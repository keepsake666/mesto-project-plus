import { Router } from 'express';
import {
  getUser,
  getUserId,
  patchMe, patchMeAvatar,
  postUser,
} from '../controllers/users';

const router = Router();

router.get('/', getUser);

router.post('/', postUser);

router.get('/:id', getUserId);

router.patch('/me', patchMe);

router.patch('/me/avatar', patchMeAvatar);
export default router;
