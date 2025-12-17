// infrastructure/db/postgres/refresh-token.repository.ts
import { RefreshTokenRepository } from '../../../packages/core/src/repositories/refresh-token.repository.js';

export class PostgresRefreshTokenRepository
    implements RefreshTokenRepository {

    constructor(private readonly db: any) { }

    async create(token: any) {
        await this.db.query(
            `
      INSERT INTO refresh_tokens (
        id, user_id, session_id,
        expires_at, created_at
      )
      VALUES ($1,$2,$3,$4,$5)
      `,
            [
                token.id,
                token.userId,
                token.sessionId,
                token.expiresAt,
                token.createdAt
            ]
        );
    }

    async findById(id: string) {
        const res = await this.db.query(
            `SELECT * FROM refresh_tokens WHERE id = $1`,
            [id]
        );
        const row = res.rows[0];
        if (!row) return null;

        return {
            id: row.id,
            userId: row.user_id,
            sessionId: row.session_id,
            expiresAt: row.expires_at,
            revokedAt: row.revoked_at
        };
    }

    async revoke(id: string) {
        await this.db.query(
            `
      UPDATE refresh_tokens
      SET revoked_at = NOW()
      WHERE id = $1
      `,
            [id]
        );
    }
}
