import { Injectable } from '@nestjs/common';
import { IAuthorizationOracle } from '../auth-users/authorization-oracle.interface'

@Injectable()
export class NoneAuthorizationService implements IAuthorizationOracle {
  isRedisAccessAuthorized(redisName: string): boolean {
    return true;
  }
}