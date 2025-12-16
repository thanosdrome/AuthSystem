import { AuthorizationCodeRepository } from '../repositories/authorization-code.repository';
import { AccessTokenService, IdTokenService } from '@/tokens';
import { Session } from '@/core';
import crypto from 'node:crypto';

function verifyPkce(
    verifier: string,
    challenge: string
) {
    const hash = crypto
        .createHash('sha256')
        .update(verifier)
        .digest('base64url');

    if (hash !== challenge) {
        throw new Error('Invalid PKCE verifier');
    }
}

export class OAuthTokenService {
    private codes: AuthorizationCodeRepository;
    private accessTokens: AccessTokenService;
    private idTokens: IdTokenService;

    constructor(
        codes: AuthorizationCodeRepository,
        accessTokens: AccessTokenService,
        idTokens: IdTokenService
    ) {
        this.codes = codes;
        this.accessTokens = accessTokens;
        this.idTokens = idTokens;
    }

    async exchangeCode(input: {
        code: string;
        clientId: string;
        session: Session;
        codeVerifier: string;
    }) {
        const authCode = await this.codes.find(input.code);

        if (!authCode) {
            throw new Error('Invalid authorization code');
        }

        if (authCode.consumedAt) {
            throw new Error('Authorization code already used');
        }

        if (authCode.expiresAt < new Date()) {
            throw new Error('Authorization code expired');
        }

        if (authCode.clientId !== input.clientId) {
            throw new Error('Client mismatch');
        }

        await this.codes.consume(authCode.code);


        const accessToken = this.accessTokens.issue({
            userId: authCode.userId,
            clientId: authCode.clientId,
            scopes: authCode.scopes,
            sessionId: input.session.id
        });

        const idToken = this.idTokens.issue({
            userId: authCode.userId,
            clientId: authCode.clientId,
            email: 'user@email.com',          // injected later
            emailVerified: true
        });

        return {
            access_token: accessToken,
            id_token: idToken,
            token_type: 'Bearer',
            expires_in: 900
        };
    }
}
