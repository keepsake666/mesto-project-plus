import { IErr } from '../types/error';

class ServerErr extends Error implements IErr {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 500;
  }
}

export default ServerErr;
