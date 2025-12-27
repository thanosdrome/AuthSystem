import jwt from 'jsonwebtoken';
import { KeyStore } from './key-stores';

export class AccessTokenSigner {
    constructor(private readonly keyStore: KeyStore) { }

    sign(payload: object) {
        const { privateKey } = this.keyStore.getActiveKey();

        return jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            keyid: this.keyStore.getActiveKid(),
            expiresIn: '15m'
        });
    }
}
