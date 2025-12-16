import crypto from 'crypto';

export class RefreshTokenService {
    generate(): { raw: string; hash: string } {
        const raw = crypto.randomBytes(64).toString('hex');
        const hash = crypto
            .createHash('sha256')
            .update(raw)
            .digest('hex');

        return { raw, hash };
    }
}
