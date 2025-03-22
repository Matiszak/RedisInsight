import { Request } from 'express';

export abstract class Authenticator {
    abstract tryAuthenticate(request: Request): Promise<void>
}