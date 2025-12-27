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
import { RateLimitService } from '@/core';
import { HealthService } from '@/core';
import { PasswordResetService } from '../../../../packages/core/src/services/password-reset.service.js';
import { PostgresPasswordResetRepository } from '../../../../infrastructure/db/postgres/password-reset.repository';
import { KeyStore } from '@/tokens';
import { AccessTokenSigner } from '@/tokens';
import { loadOrCreateRsaKey } from '@/crypto';
import { OAuthService } from '../../../../packages/core/src/services/oauth.service.js';
import { PostgresOAuthIdentityRepository } from '../../../../infrastructure/db/postgres/oauth-identity.repository.js';
import { RedisOAuthStateRepository } from '../../../../infrastructure/cache/redis/oauth-state.repository';
import { EncryptionService } from '../../../../packages/crypto/src/encryption.js';
import { PostgresKeyRepository } from '../../../../infrastructure/db/postgres/key.repository.js';
import { KeyManagerService } from '../../../../packages/tokens/src/rotation/key-manager.service.js';
import { MfaService } from '../../../../packages/core/src/services/mfa.service.js';


const { privateKey: jwtPrivateKey } = loadKeys()!;
const signer = new TokenSigner(
    'https://auth.localhost',
    jwtPrivateKey,
    'auth-key-1'
);

const MASTER_KEY = Buffer.from(process.env.MASTER_ENCRYPTION_KEY || '01234567890123456789012345678901');
const encryptionService = new EncryptionService(MASTER_KEY);

// INITIALIZE AND SEED REPOSITORIES
const userRepository = new PostgresUserRepository(pgPool);
const sessionRepository = new PostgresSessionRepository(pgPool);
const keyRepository = new PostgresKeyRepository(pgPool);
const keyManagerService = new KeyManagerService(keyRepository, encryptionService);
const mfaService = new MfaService(userRepository, encryptionService);

const authCodeRepo = new RedisAuthorizationCodeRepository(redis);
const emailVerificationRepo = new RedisEmailVerificationRepository(redis);
const refreshTokenRepo = new PostgresRefreshTokenRepository(pgPool);
const RATE_LIMIT_WINDOW = Number(process.env.RATE_LIMIT_WINDOW_SECONDS || 60);
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 10);
const RESET_TOKEN_TTL = Number(process.env.PASSWORD_RESET_TTL_SECONDS || 900);
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
    accessTokenSigner: signer,
    rateLimitService: new RateLimitService(
        redis,
        RATE_LIMIT_WINDOW,
        RATE_LIMIT_MAX
    ),
    mfaService: mfaService,
    keyManagerService: keyManagerService,
    encryptionService: encryptionService
};
export const healthService = new HealthService(
    pgPool,     // your pg pool / client
    redis   // your redis client
);
export const passwordResetService = new PasswordResetService(
    userRepository,
    new PostgresPasswordResetRepository(pgPool),
    sessionRepository,
    refreshTokenRepo,
    RESET_TOKEN_TTL
);
export const keyStore = new KeyStore();

const { kid, publicKey, privateKey } = loadOrCreateRsaKey();
keyStore.addKey(kid, publicKey, privateKey);

console.log('[JWKS] loaded signing key:', kid);

export const accessTokenSigner = new AccessTokenSigner(keyStore);
export const oauthIdentityRepository =
    new PostgresOAuthIdentityRepository(pgPool);
export const oauthService = new OAuthService(
    userRepository,
    oauthIdentityRepository
);

export const oauthStateRepository =
    new RedisOAuthStateRepository(redis);

