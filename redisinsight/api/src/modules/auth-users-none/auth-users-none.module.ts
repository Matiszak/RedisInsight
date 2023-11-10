import { DynamicModule, Global, Module } from '@nestjs/common';
import { AUTHORIZATION_ORACLE } from '../auth-users/authorization-oracle.interface'
import { NoneAuthorizationService } from './none-authorization.service';

@Global()
@Module({})
export class AuthUsersNoneModule {
  static register(): DynamicModule {
    return {
      module: AuthUsersNoneModule,
      imports: [],
      exports: [ AUTHORIZATION_ORACLE ],
      providers: [
        {
          provide: AUTHORIZATION_ORACLE,
          useClass: NoneAuthorizationService,
        }
      ],
      controllers: [],
    };
  }
}