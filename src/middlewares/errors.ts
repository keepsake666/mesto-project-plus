import {
  Response,
  Request, NextFunction,
} from 'express';
import { IErr } from '../types/error';

export default function error(
  err: IErr,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction,
) {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
}
