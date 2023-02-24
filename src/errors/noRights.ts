import { IErr } from '../types/error';

class NoRights extends Error implements IErr {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 403;
  }
}

export default NoRights;
