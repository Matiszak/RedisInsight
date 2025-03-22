import { Injectable, Logger, Scope } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Authenticator } from '../auth-users/authenticator'
import config from 'src/utils/config';

const AUTHENTICATION_CONFIG = config.get('authentication');

@Injectable({ scope: Scope.REQUEST })
export class JwtAuthenticator implements Authenticator {
  private logger = new Logger('JwtAuthenticator');
  
  constructor(
    private jwtService: JwtService
  ) {}

  async tryAuthenticate(request: Request): Promise<void> {
    const token = this.extractTokenFromHeader(request);

    if (token) {
        try {
          const payload = await this.jwtService.verifyAsync(
            token,
            { 
              "algorithms": ["RS256"],
              "clockTolerance": AUTHENTICATION_CONFIG.clockTolerance  
            }
          );
          request['user'] = payload;
        } catch(err) {
          this.logger.error('Error validating token signature. Details: ' + err)
        }
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}