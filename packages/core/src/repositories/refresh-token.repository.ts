// packages/core/src/repositories/refresh-token.repository.ts
export interface RefreshTokenRepository {
    create(token: {
        id: string;
        userId: string;
        sessionId: string;
        expiresAt: Date;
        createdAt: Date;
    }): Promise<void>;

    findById(id: string): Promise<{
        id: string;
        userId: string;
        sessionId: string;
        expiresAt: Date;
        revokedAt: Date | null;
    } | null>;

    revoke(id: string): Promise<void>;
}
