import { Request, Response } from 'express';
import mongoose from 'mongoose';
import user from '../models/user';
import { IRequestUser } from '../types/requestUser';
import NotFoundError from '../errors/notFound';

export const getUser = (req: Request, res: Response) => user.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

export const postUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return user.create({ name, about, avatar })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
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
