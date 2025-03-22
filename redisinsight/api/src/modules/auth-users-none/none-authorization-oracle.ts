import { Injectable } from '@nestjs/common';
import { AuthorizationOracle } from '../auth-users/authorization-oracle'

@Injectable()
export class NoneAuthorizationOracle implements AuthorizationOracle {
  isRedisAccessAuthorized(redisName: string): boolean {
    return true;
  }
}