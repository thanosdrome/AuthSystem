import crypto from 'crypto';
import { AuthorizationCodeRepository } from '../repositories/authorization-code.repository.js';
import { Client } from '@/core/index.js';
import { ClientValidator } from '../validators/client.validator.js';
import { ScopeValidator } from '../validators/scope.validator.js';
import { AuthorizationCode } from '../entities/authorization-code.js';

export class AuthorizationService {
    private codes: AuthorizationCodeRepository;

    constructor(codes: AuthorizationCodeRepository) {
        this.codes = codes;
    }

    async authorize(input: {
        client: Client;
        userId: string;
        redirectUri: string;
        scopes: string[];
        codeChallenge?: string;
        codeChallengeMethod?: 'S256';
    }): Promise<string> {
        if (input.client.type === 'PUBLIC') {
            if (!input.codeChallenge || input.codeChallengeMethod !== 'S256') {
                throw new Error('PKCE required for public clients');
            }
        }
        ClientValidator.validateRedirectUri(input.client, input.redirectUri);
        ScopeValidator.validate(input.client, input.scopes);

        const code: AuthorizationCode = {
            code: crypto.randomBytes(32).toString('hex'),
            clientId: input.client.id,
            userId: input.userId,
            redirectUri: input.redirectUri,
            scopes: input.scopes,
            expiresAt: new Date(Date.now() + 1000 * 60 * 5), // 5 min
            createdAt: new Date()
        };

        await this.codes.create(code);
        return code.code;
    }
}
