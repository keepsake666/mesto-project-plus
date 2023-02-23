import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import card from '../models/card';
import { IRequestUser } from '../types/requestUser';
import NotFoundError from '../errors/notFound';
import ServerErr from '../errors/server';
import ValidationErr from '../errors/validate';
import AuthErr from '../errors/auth';

export const getCards = (req: Request, res: Response, next: NextFunction) => card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(() => next(new ServerErr('На сервере произошла ошибка')));

export const postCards = (req: IRequestUser, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const id = req.user?._id;
  return card.create({ name, link, owner: id })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationErr('Переданы некорректные данные при создании карточки.'));
      }
      return next(new ServerErr('На сервере произошла ошибка'));
    });
};

export const deleteCard = (req: IRequestUser, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const owner = req.user?._id;

  return card.findByIdAndRemove(id)
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }
      if (owner !== cards.owner.toString()) {
        throw new AuthErr('Нет прав на удаление');
      }
      return res.send({ data: cards });
    })
    .catch((err) => {
      if (err instanceof NotFoundError || AuthErr) {
        return next(err);
      }
      return next(new ServerErr('На сервере произошла ошибка'));
    });
};

export const likeCard = (req: IRequestUser, res: Response, next: NextFunction) => {
  const id = req.user?._id;

  return card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: id } },
    {
      new: true,
    },
  )
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return next(err);
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new ValidationErr('Переданы некорректные данные для постановки/снятии лайка.'));
      }
      return next(new ServerErr('На сервере произошла ошибка'));
    });
};

export const dislikeCard = (req: IRequestUser, res: Response, next: NextFunction) => {
  const id = req.user!._id;
  return card.findByIdAndUpdate(req.params.id, { $pull: { likes: id } }, { new: true })
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.name === err instanceof mongoose.Error.CastError) {
        return next(new ValidationErr('Переданы некорректные данные для постановки/снятии лайка.'));
      }
      if (err instanceof NotFoundError) {
        return next(err);
      }
      return next(new ServerErr('На сервере произошла ошибка'));
    });
};
