import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import ERROR_MESSAGES from 'src/constants/error-messages';

  @Injectable()
  export class AuthUsersJwtGuard implements CanActivate {
    constructor() {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();

      if (!request['user']) {
        throw new UnauthorizedException(ERROR_MESSAGES.USER_NOT_AUTHENTICATED);
      }

      return true;
    }
  }