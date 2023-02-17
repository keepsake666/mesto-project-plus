import { Router } from 'express';
import {
  deleteCard, dislikeCard, getCards, likeCard, postCards,
} from '../controllers/cards';

const router = Router();

router.get('/', getCards);

router.post('/', postCards);

router.delete('/:id', deleteCard);

router.put('/:id/likes', likeCard);

router.delete('/:id/likes', dislikeCard);
export default router;
