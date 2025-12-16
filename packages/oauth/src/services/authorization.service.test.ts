import { describe, it, expect } from 'vitest';
import { AuthorizationService } from './authorization.service.js';

const repo = {
    create: async () => { }
};

describe('AuthorizationService', () => {
    it('issues authorization code', async () => {
        const service = new AuthorizationService(repo as any);

        const code = await service.authorize({
            client: {
                id: 'client-1',
                redirectUris: ['http://localhost/callback'],
                allowedScopes: ['openid'],
                type: 'PUBLIC'
            } as any,
            userId: 'user-1',
            redirectUri: 'http://localhost/callback',
            scopes: ['openid'],
            codeChallenge: 'abc',
            codeChallengeMethod: 'S256'
        });

        expect(code).toBeDefined();
    });
});
