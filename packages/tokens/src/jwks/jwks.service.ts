import { KeyManagerService } from '../rotation/key-manager.service.js';

export interface JwkKey {
    kid: string;
    kty: 'RSA';
    alg: 'RS256';
    use: 'sig';
    n: string;
    e: string;
}

export class JwksService {
    constructor(private readonly keyManager: KeyManagerService) { }

    async getJwks() {
        const keys = await this.keyManager.getVerificationKeys();
        // Simplified transformation logic for PEM to JWK
        // In a real implementation, you'd use a library like 'jose' or 'node-jose'
        return {
            keys: keys.map(k => ({
                kid: k.kid,
                kty: 'RSA',
                alg: 'RS256',
                use: 'sig',
                // These should be extracted from the public key PEM
                n: '...',
                e: 'AQAB'
            }))
        };
    }
}
