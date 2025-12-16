import jwt, { JwtPayload } from 'jsonwebtoken';

export class TokenVerifier {
    constructor(
        private readonly issuer: string,
        private readonly publicKeys: Record<string, string>
    ) { }

    verify(token: string): JwtPayload {
        const decoded = jwt.decode(token, { complete: true });

        if (!decoded || typeof decoded === 'string') {
            throw new Error('Invalid token format');
        }

        if (!decoded.header.kid) {
            throw new Error('Token header missing key ID');
        }

        const key = this.publicKeys[decoded.header.kid];
        if (!key) {
            throw new Error('Unknown signing key');
        }

        return jwt.verify(token, key, {
            algorithms: ['RS256'],
            issuer: this.issuer
        }) as JwtPayload;
    }
}
