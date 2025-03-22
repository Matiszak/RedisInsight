import { Injectable, Scope } from '@nestjs/common';
import { Request } from 'express';
import { Authenticator } from '../auth-users/authenticator'

@Injectable({ scope: Scope.REQUEST })
export class NoneAuthenticator implements Authenticator {
  async tryAuthenticate(request: Request): Promise<void> {
  }
}