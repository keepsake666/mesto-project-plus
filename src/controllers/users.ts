import { Request, Response } from 'express';
import user from '../models/user';

export const getUser = (req: Request, res: Response) => user.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

export const postUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return user.create({ name, about, avatar })
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const getUserId = (req: Request, res: Response) => user.findById(req.params.id)
  .then((users) => {
    if (!users) {
      res.send({ message: 'Произошла ошибка' });
    }
    res.send({ data: users });
  })
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
