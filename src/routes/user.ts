import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUser,
  getUserId, getUserMe,
  patchMe, patchMeAvatar,
} from '../controllers/users';
import { valid } from '../constants/app';

const router = Router();

router.get('/', getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), patchMe);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(valid),
  }),
}), patchMeAvatar);

router.get('/me', getUserMe);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), getUserId);

export default router;
