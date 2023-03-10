import { IErr } from '../types/error';

class ValidationErr extends Error implements IErr {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 400;
  }
}

export default ValidationErr;
