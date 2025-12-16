import { describe, it, expect } from 'vitest';
import { AccessTokenService } from './tokens/access-token.js';
import { TokenSigner } from './signer.js';

describe('AccessTokenService', () => {
    it('issues signed access token', () => {
        const signer = new TokenSigner(
            'http://auth.local',
            process.env.JWT_PRIVATE_KEY!,
            'test-key'
        );

        const service = new AccessTokenService(signer);

        const token = service.issue({
            userId: 'user-1',
            clientId: 'client-1',
            scopes: ['openid'],
            sessionId: 'session-1'
        });

        expect(typeof token).toBe('string');
    });
});
