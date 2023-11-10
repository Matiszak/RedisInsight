export interface IAuthorizationOracle {
    isRedisAccessAuthorized(redisName: string): boolean
  }
  
export const AUTHORIZATION_ORACLE = 'AUTHORIZATION_ORACLE';