export abstract class AuthorizationOracle {
    abstract isRedisAccessAuthorized(redisName: string): boolean
}