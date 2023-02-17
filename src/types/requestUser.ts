import { Request } from 'express';

export interface IRequestUser extends Request {
  user?: {
    _id: string;
  };
}
