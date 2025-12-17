// packages/tokens/src/refresh-token.service.ts
import { randomId } from '@/crypto';

export class RefreshTokenService {
    constructor(
        private readonly repo: any,
        private readonly accessTokenSigner: any,
        private readonly ttlSeconds: number
    ) { }

    async issue(userId: string, sessionId: string) {
        const tokenId = randomId(32);

        await this.repo.create({
            id: tokenId,
            userId,
            sessionId,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + this.ttlSeconds * 1000)
        });

        return tokenId;
    }

    async rotate(oldTokenId: string) {
        const token = await this.repo.findById(oldTokenId);

        if (!token || token.revokedAt || token.expiresAt < new Date()) {
            throw new Error('INVALID_REFRESH_TOKEN');
        }

        // revoke old token
        await this.repo.revoke(oldTokenId);

        // issue new one
        const newTokenId = randomId(32);
        await this.repo.create({
            id: newTokenId,
            userId: token.userId,
            sessionId: token.sessionId,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + this.ttlSeconds * 1000)
        });

        // issue new access token
        const accessToken = this.accessTokenSigner.sign({
            sub: token.userId,
            sid: token.sessionId
        });

        return {
            accessToken,
            refreshToken: newTokenId
        };
    }
}
