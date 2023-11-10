import { Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import ERROR_MESSAGES from 'src/constants/error-messages';
import * as permissionsConfig from '../../../config/permissions-config.json';
import { AuthorizationOracle } from '../auth-users/authorization-oracle'

@Injectable({ scope: Scope.REQUEST })
export class JwtAuthorizationOracle implements AuthorizationOracle {
  constructor(
    @Inject(REQUEST) private request
  ) {}

  isRedisAccessAuthorized(redisName: string): boolean {
    let user = this.request.user;

    if(!user) {
        throw new UnauthorizedException(ERROR_MESSAGES.USER_NOT_AUTHENTICATED);
    }

    let permission = permissionsConfig.redisToPermissionMapping && permissionsConfig.redisToPermissionMapping[redisName];

    if(!permission) {
      return !!permissionsConfig.allowAccessToUnrecognizedRedises;
    }
    
    return user.role && Array.isArray(user.role) && user.role.contains(permission);
  }
}