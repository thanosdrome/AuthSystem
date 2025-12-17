import crypto from 'crypto';
import { RefreshTokenRepository } from '@/core';
import { TokenSigner } from '../signer';

export class RefreshTokenService {
    constructor(
        private readonly tokens: RefreshTokenRepository,
        private readonly signer: TokenSigner
    ) { }

    generate(): { raw: string; hash: string } {
        const raw = crypto.randomBytes(64).toString('hex');
        const hash = crypto
            .createHash('sha256')
            .update(raw)
            .digest('hex');

        return { raw, hash };
    }

    async issue(userId: string, sessionId: string): Promise<string> {
        const { raw, hash } = this.generate();

        await this.tokens.create({
            id: hash,
            userId,
            sessionId,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days
        });

        return raw;
    }

    async rotate(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        const hash = crypto
            .createHash('sha256')
            .update(refreshToken)
            .digest('hex');

        const token = await this.tokens.findById(hash);

        if (!token || token.revokedAt || token.expiresAt < new Date()) {
            throw new Error('INVALID_REFRESH_TOKEN');
        }

        await this.tokens.revoke(hash);

        const newRefreshToken = await this.issue(token.userId, token.sessionId);
        const newAccessToken = this.signer.sign(
            {
                sub: token.userId,
                sid: token.sessionId
            },
            3600 // 1 hour
        );

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    }
}
