import { TokenSigner } from '../signer.js';
import { AccessTokenClaims } from '../claims/access.claims.js';
import crypto from 'crypto';

export class AccessTokenService {
    private signer: TokenSigner;

    constructor(signer: TokenSigner) {
        this.signer = signer;
    }

    issue(input: {
        userId: string;
        clientId: string;
        scopes: string[];
        sessionId: string;
    }): string {
        const claims: AccessTokenClaims = {
            type: 'access',
            iss: 'https://auth.yourcompany.com',
            sub: input.userId,
            aud: input.clientId,
            scope: input.scopes,
            session_id: input.sessionId,
            iat: Math.floor(Date.now() / 1000),
            exp: 0, // overridden by signer
            jti: crypto.randomUUID()
        };

        return this.signer.sign(claims, 60 * 15); // 15 minutes
    }
}
