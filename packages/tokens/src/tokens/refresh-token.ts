import crypto from 'crypto';
import { RefreshTokenRepository } from '@/core';
import { TokenSigner } from '../signer';

export class RefreshTokenService {
    constructor(
        private readonly tokens: RefreshTokenRepository,
        private readonly signer: TokenSigner,
        private readonly redis?: any
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

        // 1. Acquire Lock (if redis is available)
        const lockKey = `lock:rotate:${hash}`;
        let lockAcquired = false;
        if (this.redis) {
            lockAcquired = await this.redis.set(lockKey, '1', {
                NX: true,
                PX: 5000 // 5s lock
            });
            if (!lockAcquired) {
                console.warn('Rotation lock contention detected for token:', hash);
                throw new Error('ROTATION_IN_PROGRESS');
            }
        }

        try {
            const token = await this.tokens.findById(hash);

            if (!token || token.expiresAt < new Date()) {
                throw new Error('INVALID_REFRESH_TOKEN');
            }

            // 2. Handling the Grace Window
            if (token.revokedAt) {
                const GRACE_WINDOW_MS = 10000; // 10 seconds
                if (token.rotatedAt && (Date.now() - token.rotatedAt.getTime() < GRACE_WINDOW_MS)) {
                    throw new Error('TOKEN_ALREADY_ROTATED_IN_GRACE_WINDOW');
                }

                // If revoked and NOT in grace window, it's a reuse attack!
                await this.tokens.revokeBySession(token.sessionId);
                throw new Error('TOKEN_REUSE_DETECTED');
            }

            // 3. Perform Rotation
            await this.tokens.markRotated(hash);

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
        } finally {
            if (lockAcquired) {
                await this.redis.del(lockKey);
            }
        }
    }
}
