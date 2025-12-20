import { RefreshTokenRepository } from "../repositories/refresh-token.repository.js";
import { SessionRepository } from "../repositories/session.repository.js";

export class LogoutService {
    constructor(
        private readonly refreshTokens: RefreshTokenRepository,
        private readonly sessions: SessionRepository
    ) { }

    async logout(refreshTokenId: string) {
        const token = await this.refreshTokens.findById(refreshTokenId);
        if (!token || token.revokedAt) {
            return; // idempotent
        }

        const now = new Date();

        // Revoke the specific refresh token
        await this.refreshTokens.revoke(refreshTokenId);

        // Revoke the session with explicit timestamp
        await this.sessions.revoke(token.sessionId, now);

        // Revoke all refresh tokens for this session
        await this.refreshTokens.revokeBySession(token.sessionId);
    }
}
