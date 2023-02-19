import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import user from '../models/user';
import { IRequestUser } from '../types/requestUser';
import NotFoundError from '../errors/notFound';

export const getUser = (req: Request, res: Response) => user.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

export const postUser = (req: Request, res: Response) => {
  const {
    name = 'Жак-Ив Кусто',
    about = 'Исследователь',
    avatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    email,
    password,
  } = req.body;
  return user.findOne({ email })
    .then((userMail) => {
      if (!userMail) {
        return bcrypt.hash(password, 10).then((hash) => user.create({
          name, about, avatar, email, password: hash,
        }).then((users) => res.send({ data: users }))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
            } else {
              res.status(500).send({ message: 'Произошла ошибка' });
            }
          }));
      }
      throw new NotFoundError(' Такой email уже есть');
    }).catch(() => res.status(404).send({ message: 'Такой email уже есть' }));
};

export const getUserId = (req: Request, res: Response) => user.findById(req.params.id)
  .then((users) => {
    if (!users) {
      throw new NotFoundError(' Пользователь по указанному _id не найден');
    }
    res.send({ data: users });
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(400).send({ message: 'Переданный id пользователя не валиден' });
    }
    if (err instanceof Error && err instanceof NotFoundError) {
      return res.status(404).send({ message: ' Пользователь по указанному _id не найден.' });
    }
    res.status(500).send({ message: 'Произошла ошибка' });
  });

export const patchMe = (req: IRequestUser, res: Response) => {
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
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      if (err instanceof Error && err instanceof NotFoundError) {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

export const patchMeAvatar = (req: IRequestUser, res: Response) => {
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
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      if (err instanceof Error && err instanceof NotFoundError) {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  return user.findUserByCredentials(email, password)
    .then((users) => {
      const token = jwt.sign({ _id: users._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      // ошибка аутентификации
      res
        .status(401)
        .send({ message: err.message });
    });
};

export const getUserMe = (req: IRequestUser, res: Response) => {
  const id = req.user?._id;
  return user.findById(id)
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err instanceof Error && err instanceof NotFoundError) {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};
