import { Router } from 'express';
import {
  getUser,
  getUserId,
  postUser,
} from '../controllers/users';

const router = Router();

router.get('/', getUser);

router.post('/', postUser);

router.get('/:id', getUserId);
export default router;
