import { IErr } from '../types/error';

class NotFoundError extends Error implements IErr {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}

export default NotFoundError;
