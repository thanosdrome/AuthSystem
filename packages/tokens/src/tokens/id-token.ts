import { TokenSigner } from '../signer.js';
import { IdTokenClaims } from '../claims/id.claims.js';
import crypto from 'crypto';

export class IdTokenService {
    private signer: TokenSigner;

    constructor(signer: TokenSigner) {
        this.signer = signer;
    }

    issue(input: {
        userId: string;
        clientId: string;
        email: string;
        emailVerified: boolean;
    }): string {
        const claims: IdTokenClaims = {
            type: 'id',
            iss: 'https://auth.yourcompany.com',
            sub: input.userId,
            aud: input.clientId,
            email: input.email,
            email_verified: input.emailVerified,
            iat: Math.floor(Date.now() / 1000),
            exp: 0,
            jti: crypto.randomUUID()
        };

        return this.signer.sign(claims, 60 * 10); // 10 minutes
    }
}
