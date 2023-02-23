import { IErr } from '../types/error';

class AuthErr extends Error implements IErr {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}

export default AuthErr;
