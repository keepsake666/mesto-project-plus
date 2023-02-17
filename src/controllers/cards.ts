import { Request, Response } from 'express';
import card from '../models/card';
import { IRequestUser } from '../types/requestUser';

export const getCards = (req: Request, res: Response) => card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

export const postCards = (req: IRequestUser, res: Response) => {
  const { name, link } = req.body;
  const id = req.user?._id;
  return card.create({ name, link, owner: id })
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const deleteCard = (req: Request, res: Response) => {
  const { id } = req.params;

  return card.findByIdAndRemove(id)
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const likeCard = (req: IRequestUser, res: Response) => {
  const id = req.user?._id;

  return card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: id } },
    { new: true },
  )
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const dislikeCard = (req: IRequestUser, res: Response) => {
  const id = req.user!._id;

  return card.findByIdAndUpdate(req.params.id, { $pull: { likes: [id] } }, { new: true })
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
