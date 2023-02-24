import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AuthErr from '../errors/auth';

interface IAuthRequest extends Request {
  user?: string | JwtPayload
}
export default (req: IAuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  const { JWT = 'some-secret-key' } = process.env;
  let payload;

  try {
    if (JWT) payload = jwt.verify(token, JWT);
  } catch (err) {
    next(new AuthErr('Необходима авторизация'));
    return;
  }

  req.user = payload;
  next(); // пропускаем запрос дальше
};
