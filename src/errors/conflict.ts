import { IErr } from '../types/error';

class ConflictErr extends Error implements IErr {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 409;
  }
}

export default ConflictErr;
