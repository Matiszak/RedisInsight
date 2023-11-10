import { DynamicModule, Global, Module } from '@nestjs/common';
import { Authenticator } from '../auth-users/authenticator';
import { AuthorizationOracle } from '../auth-users/authorization-oracle'
import { NoneAuthorizationOracle } from './none-authorization-oracle';
import { NoneAuthenticator } from './none-authenticator';

@Global()
@Module({})
export class AuthUsersNoneModule {
  static register(): DynamicModule {
    return {
      module: AuthUsersNoneModule,
      imports: [],
      exports: [ AuthorizationOracle, Authenticator ],
      providers: [
        {
          provide: AuthorizationOracle,
          useClass: NoneAuthorizationOracle,
        },
        {
          provide: Authenticator,
          useClass: NoneAuthenticator,
        }
      ],
      controllers: [],
    };
  }
}