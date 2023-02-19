import { Router } from 'express';
import {
  getUser,
  getUserId, getUserMe,
  patchMe, patchMeAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUser);

router.patch('/me', patchMe);

router.patch('/me/avatar', patchMeAvatar);

router.get('/me', getUserMe);

router.get('/:id', getUserId);

export default router;
