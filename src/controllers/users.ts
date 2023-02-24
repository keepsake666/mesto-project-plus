import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import user from '../models/user';
import { IRequestUser } from '../types/requestUser';
import NotFoundError from '../errors/notFound';
import ServerErr from '../errors/server';
import ValidationErr from '../errors/validate';
import ConflictErr from '../errors/conflict';
import AuthErr from '../errors/auth';

export const getUser = (req: Request, res: Response, next: NextFunction) => user.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => next(new ServerErr('На сервере произошла ошибка')));

export const creatUser = (req: Request, res: Response, next:NextFunction) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  return bcrypt.hash(password, 10).then((hash) => user.create({
    name, about, avatar, email, password: hash,
  })
    .then((users) => {
      res.send({
        body: {
          name: users.name,
          about: users.about,
          avatar: users.avatar,
          email: users.email,
          _id: users._id,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationErr('Переданы некорректные данные при создании пользователя.'));
      }
      if (err.code === 11000) {
        return next(new ConflictErr('Пользователь с переданным email уже существует'));
      }
      return next(new ServerErr('На сервере произошла ошибка'));
    }));
};

export const getUserId = (req: Request, res: Response, next: NextFunction) => {
  user.findById(req.params.id)
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return next(err);
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new ValidationErr('Переданный id пользователя не валиден'));
      }
      return next(new ServerErr('На сервере произошла ошибка'));
    });
};

export const patchMe = (req: IRequestUser, res: Response, next:NextFunction) => {
  const id = req.user!._id;
  const { name, about } = req.body;
  user.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationErr('Переданы некорректные данные при обновлении профиля.'));
      }
      if (err instanceof NotFoundError) {
        return next(err);
      }
      return next(new ServerErr('На сервере произошла ошибка'));
    });
};

export const patchMeAvatar = (req: IRequestUser, res: Response, next: NextFunction) => {
  const id = req.user!._id;
  const { avatar } = req.body;
  user.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationErr('Переданы некорректные данные при обновлении профиля.'));
      }
      if (err instanceof NotFoundError) {
        return next(err);
      }
      return next(new ServerErr('На сервере произошла ошибка'));
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return user.findUserByCredentials(email, password)
    .then((users) => {
      const { JWT = 'some-secret-key' } = process.env;
      const token = jwt.sign({ _id: users._id }, JWT, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      }).send({ token });
    })
    .catch((err) => {
      if (err.message === 'Неправильные почта или пароль') {
        return next(new AuthErr('Неправильные почта или пароль'));
      }
      return next(new ServerErr('На сервере произошла ошибка'));
    });
};

export const getUserMe = (req: IRequestUser, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  return user.findById(id)
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return next(err);
      }
      return next(new ServerErr('На сервере произошла ошибка'));
    });
};
