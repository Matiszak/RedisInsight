import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Authenticator } from 'src/modules/auth-users/authenticator';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private authenticator: Authenticator
  ) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<any> {
    this.authenticator.tryAuthenticate(req);
    next();
  }
}
  