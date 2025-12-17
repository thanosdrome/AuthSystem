import { AuthService } from '@/core';
import { AccessTokenService } from '@/tokens';
import { AuthorizationService } from '@/oauth';
import { IdTokenService } from '@/tokens';
import { TokenSigner } from '@/tokens';
import { OAuthTokenService } from '@/oauth';
import { loadKeys } from './keys.js';
import { RegistrationService } from '@/core';
import { pgPool } from '../../../../infrastructure/db/postgres/client.js';
import { redis } from '../../../../infrastructure/cache/redis/client';
import { PostgresUserRepository } from '../../../../infrastructure/db/postgres/user.repository';
import { PostgresSessionRepository } from '../../../../infrastructure/db/postgres/session.repository';
import { RedisAuthorizationCodeRepository } from '../../../../infrastructure/cache/redis/authorization-code.store';
import { RedisEmailVerificationRepository } from '../../../../infrastructure/cache/redis/email-verification.repository';
import { EmailVerificationService } from '../services/email-verification.service.js';
import { RefreshTokenService } from '@/tokens';
import { PostgresRefreshTokenRepository } from '../../../../infrastructure/db/postgres/refresh-token.repository';


const { privateKey: jwtPrivateKey } = loadKeys()!;

const signer = new TokenSigner(
    'https://auth.localhost',
    jwtPrivateKey,
    'auth-key-1'
);

// INITIALIZE AND SEED REPOSITORIES
const userRepository = new PostgresUserRepository(pgPool);
const sessionRepository = new PostgresSessionRepository(pgPool);
const authCodeRepo = new RedisAuthorizationCodeRepository(redis);
const emailVerificationRepo = new RedisEmailVerificationRepository(redis);
const refreshTokenRepo = new PostgresRefreshTokenRepository(pgPool);


// Seed a test user
// Note: login.controller currently passes email as userId, so we use email as ID here for valid lookup
export const container = {
    authService: new AuthService(userRepository, sessionRepository),
    registrationService: new RegistrationService(userRepository),
    authorizationService: new AuthorizationService(authCodeRepo),
    oauthTokenService: new OAuthTokenService(
        authCodeRepo,
        new AccessTokenService(signer),
        new IdTokenService(signer)
    ),
    emailVerificationService: new EmailVerificationService(
        emailVerificationRepo,
        userRepository,
        Number(process.env.EMAIL_VERIFY_TOKEN_TTL)
    ),
    refreshTokenService: new RefreshTokenService(refreshTokenRepo, signer),
    accessTokenSigner: signer
};
