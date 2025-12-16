import { AuthService } from '@/core/services/auth.service.js';
import { AccessTokenService } from '@/tokens/tokens/access-token.js';
import { AuthorizationService } from '@/oauth/services/authorization.service.js';
import { IdTokenService } from '@/tokens/tokens/id-token.js';
import { TokenSigner } from '@/tokens/signer.js';
import { OAuthTokenService } from '@/oauth/services/token.service.js';
import { loadKeys } from './keys.js';
import {
    InMemoryUserRepo,
    InMemorySessionRepo,
    InMemoryAuthCodeRepo
} from './inmemory.js';
import { UserStatus } from '@/core/enums/user-status.js';

const { privateKey: jwtPrivateKey } = loadKeys()!;

const signer = new TokenSigner(
    'https://auth.localhost',
    jwtPrivateKey,
    'auth-key-1'
);

// INITIALIZE AND SEED REPOSITORIES
const userRepo = new InMemoryUserRepo();
const sessionRepo = new InMemorySessionRepo();
const authCodeRepo = new InMemoryAuthCodeRepo();

// Seed a test user
// Note: login.controller currently passes email as userId, so we use email as ID here for valid lookup
userRepo.create({
    id: 'test@example.com',
    email: 'test@example.com',
    status: UserStatus.ACTIVE,
    passwordHash: 'placeholder', // Password check is currently stubbed in controller
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
} as any).catch(console.error);

export const container = {
    authService: new AuthService(
        userRepo,
        sessionRepo
    ),

    authorizationService: new AuthorizationService(
        authCodeRepo
    ),

    oauthTokenService: new OAuthTokenService(
        authCodeRepo,
        new AccessTokenService(signer),
        new IdTokenService(signer)
    )
};
