import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtSecretRequestType } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import config from 'src/utils/config';
import * as crypto from 'crypto';
import { AUTHORIZATION_ORACLE } from '../auth-users/authorization-oracle.interface'
import { AuthUsersJwtGuard } from './auth-users-jwt.guard';
import { JwtAuthorizationService } from './jwt-authorization.service';

const AUTHENTICATION_CONFIG = config.get('authentication');

const logger = new Logger('JwtAuthenticationModule');
let pemPublicKey = undefined;

async function regeneratePublicKey() {
  try {
    logger.log("Starting to regenerate jwks key from " + AUTHENTICATION_CONFIG.jwksEndpoint + "...");
    let response = await fetch(AUTHENTICATION_CONFIG.jwksEndpoint);
  
    if(response.status < 200 || response.status > 299) {
      var responseText = await response.text();
      logger.error("Invalid response when getting jwks data.\n"
        + "Status: " + response.status
        + "Response body: " + responseText);
      return;
    }
  
    let keys = await response.json();

    if(!keys || !Array.isArray(keys.keys) || keys.keys.length === 0) {
      logger.error("Keys returned from jwks are empty.");
      return;
    }

    let jwtKey = keys.keys[0];
    let pemKey = crypto.createPublicKey({ key: jwtKey, format: 'jwk'})
    pemPublicKey = pemKey.export({ format: "pem", type: "pkcs1"}).toString();
    logger.log("Regenerated successfully jwks key.");
  } catch(err) {
    logger.error("Error when fetchin jwks:" + err);
  }
}

function fetchPublicKey(
  requestType: JwtSecretRequestType,
  tokenOrPayload: string | Object | Buffer,
  verifyOrSignOrOptions?: jwt.VerifyOptions | jwt.SignOptions
): jwt.Secret {
  switch (requestType) {
    case JwtSecretRequestType.SIGN:
      throw new Error("Signing tokens is unsupported");
    case JwtSecretRequestType.VERIFY:
      if(!pemPublicKey) {
        throw new Error("Public key is not initialized. It might be problem with fetching it from JWKS. Please verify other log entries regarding jwks.");
      }
      // retrieve public key for verification dynamically
      return pemPublicKey;
    default:
      throw new Error("Symmetric secrets are not supported")
  }
};

@Module({})
@Global()
export class AuthUsersJwtModule {
  static register(): DynamicModule {
    setInterval(regeneratePublicKey, 5 * 60 * 1000);
    setTimeout(regeneratePublicKey, 100);

    return {
      module: AuthUsersJwtModule,
      imports: [
        JwtModule.register({
          global: true,
          secretOrKeyProvider: fetchPublicKey
        }),
      ],
      exports: [ AUTHORIZATION_ORACLE ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: AuthUsersJwtGuard,
        },
        {
          provide: AUTHORIZATION_ORACLE,
          useClass: JwtAuthorizationService,
        }
      ],
      controllers: [],
    };
  }
}