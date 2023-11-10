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
    
    if(!Array.isArray(permission)) {
      return false;
    }

    let isAnyAccessGranted = false;
    for(let i = 0; i < permission.length; i++) {
      let permissionRule = permission[i];
      let claimsToCheck = Object.keys(permissionRule);

      let ruleSuccessful = true;
      for(let j = 0; j < claimsToCheck.length; j++) {
        let claimName = claimsToCheck[j];
        let requiredClaimValue = permissionRule[claimName];
        let actualClaimValue = user[claimName];

        if(Array.isArray(requiredClaimValue)) {
          if(!Array.isArray(actualClaimValue)) {
            ruleSuccessful = false;
            break;
          } else {
            for(let k = 0; k < requiredClaimValue.length; k++) {
              if(!actualClaimValue.includes(requiredClaimValue[k])) {
                ruleSuccessful = false;
                break; 
              }
            }
          }
        } else {
          if(Array.isArray(actualClaimValue)) {
            if(!actualClaimValue.includes(requiredClaimValue)) {
              ruleSuccessful = false;
              break;
            }
          } else {
            if(actualClaimValue !== requiredClaimValue) {
              ruleSuccessful = false;
              break;
            }
          }
        }
      }
      
      if(ruleSuccessful) {
        isAnyAccessGranted = true;
        break;
      }
    }

    return isAnyAccessGranted;
  }
}