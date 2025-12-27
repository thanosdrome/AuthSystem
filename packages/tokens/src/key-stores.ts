import { createPublicKey } from 'crypto';
import { Jwk } from '@/core';

export class KeyStore {
    private keys = new Map<string, { publicKey: string; privateKey: string }>();
    private activeKid!: string;

    addKey(kid: string, publicKey: string, privateKey: string) {
        this.keys.set(kid, { publicKey, privateKey });
        this.activeKid = kid;
    }

    getActiveKey() {
        return this.keys.get(this.activeKid)!;
    }

    getActiveKid() {
        return this.activeKid;
    }

    getJwks(): { keys: Jwk[] } {
        const jwks: Jwk[] = [];

        for (const [kid, key] of this.keys.entries()) {
            const pub = createPublicKey(key.publicKey).export({ format: 'jwk' }) as any;

            jwks.push({
                kty: 'RSA',
                kid,
                use: 'sig',
                alg: 'RS256',
                n: pub.n,
                e: pub.e
            });
        }

        return { keys: jwks };
    }
}
