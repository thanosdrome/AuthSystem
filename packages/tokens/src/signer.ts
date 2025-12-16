import jwt from 'jsonwebtoken';
import { randomId } from '@/crypto/index.js';

export class TokenSigner {
    private issuer: string;
    private privateKey: string;
    private keyId: string;

    constructor(issuer: string, privateKey: string, keyId: string) {
        this.issuer = issuer;
        this.privateKey = privateKey;
        this.keyId = keyId;
    }

    sign<T extends object>(
        claims: T,
        expiresInSeconds: number
    ): string {
        return jwt.sign(
            {
                ...claims,
                jti: randomId(16)
            },
            this.privateKey,
            {
                algorithm: 'RS256',
                expiresIn: expiresInSeconds,
                issuer: this.issuer,
                keyid: this.keyId
            }
        );
    }
}
