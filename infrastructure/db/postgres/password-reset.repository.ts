import { PasswordResetRepository } from '../../../packages/core/src/repositories/password-reset.repository.js';

export class PostgresPasswordResetRepository
    implements PasswordResetRepository {

    constructor(private readonly db: any) { }

    async create(token: any) {
        await this.db.query(
            `
      INSERT INTO password_reset_tokens
      (id, user_id, expires_at, created_at)
      VALUES ($1,$2,$3,$4)
      `,
            [token.id, token.userId, token.expiresAt, token.createdAt]
        );
    }

    async findById(id: string) {
        const res = await this.db.query(
            `SELECT * FROM password_reset_tokens WHERE id = $1`,
            [id]
        );
        const row = res.rows[0];
        if (!row) return null;

        return {
            id: row.id,
            userId: row.user_id,
            expiresAt: row.expires_at,
            usedAt: row.used_at
        };
    }

    async markUsed(id: string, usedAt: Date) {
        await this.db.query(
            `
      UPDATE password_reset_tokens
      SET used_at = $2
      WHERE id = $1
      `,
            [id, usedAt]
        );
    }

    async deleteAllForUser(userId: string) {
        await this.db.query(
            `DELETE FROM password_reset_tokens WHERE user_id = $1`,
            [userId]
        );
    }
}
