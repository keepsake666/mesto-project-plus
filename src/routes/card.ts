import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  deleteCard, dislikeCard, getCards, likeCard, postCards,
} from '../controllers/cards';
import { valid } from '../constants/app';

const router = Router();

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(valid),
  }),
}), postCards);

router.delete('/:id', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);

router.put('/:id/likes', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), likeCard);

router.delete('/:id/likes', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), dislikeCard);
export default router;
