import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import * as permissionsConfig from '../../../config/permissions-config.json';
import { IAuthorizationOracle } from '../auth-users/authorization-oracle.interface'

@Injectable()
export class JwtAuthorizationService implements IAuthorizationOracle {
  constructor(
    @Inject(REQUEST) private request
  ) {}

  isRedisAccessAuthorized(redisName: string): boolean {
    let user = this.request.user;

    if(!user) {
        throw new UnauthorizedException('User is not authenticated. JwtAuthorizationService requires authentication to happen before authorization.');
    }

    let permission = permissionsConfig.redisToPermissionMapping && permissionsConfig.redisToPermissionMapping[redisName];

    if(!permission) {
      return !!permissionsConfig.allowAccessToUnrecognizedRedises;
    }
    
    return user.role && Array.isArray(user.role) && user.role.contains(permission);
  }
}