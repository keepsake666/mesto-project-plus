import { Request, Response } from 'express';
import card from '../models/card';
import { IRequestUser } from '../types/requestUser';
import NotFoundError from '../errors/notFound';

export const getCards = (req: Request, res: Response) => card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

export const postCards = (req: IRequestUser, res: Response) => {
  const { name, link } = req.body;
  const id = req.user?._id;
  return card.create({ name, link, owner: id })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

export const deleteCard = (req: IRequestUser, res: Response) => {
  const { id } = req.params;
  const owner = req.user?._id;

  return card.findByIdAndRemove(id)
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }
      if (owner !== cards.owner.toString()) {
        throw new NotFoundError('Нет прав на удаление');
      }
      return res.send({ data: cards });
    })
    .catch((err) => {
      if (err instanceof Error && err instanceof NotFoundError) {
        return res.status(404).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

export const likeCard = (req: IRequestUser, res: Response) => {
  const id = req.user?._id;

  return card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: id } },
    { new: true },
  )
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      }
      if (err instanceof Error && err instanceof NotFoundError) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

export const dislikeCard = (req: IRequestUser, res: Response) => {
  const id = req.user!._id;
  return card.findByIdAndUpdate(req.params.id, { $pull: { likes: id } }, { new: true })
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      }
      if (err instanceof Error && err instanceof NotFoundError) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};
