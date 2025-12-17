// infrastructure/db/postgres/session.repository.ts
import { SessionRepository } from '../../../packages/core/src/repositories/session.repository.js';
import { Session } from '../../../packages/core/src/entities/session.js';

export class PostgresSessionRepository implements SessionRepository {
    constructor(private readonly db: any) { }

    async findById(id: string): Promise<Session | null> {
        const res = await this.db.query(
            'SELECT * FROM sessions WHERE id = $1',
            [id]
        );
        return res.rows[0] ?? null;
    }
    async update(session: Session): Promise<void> {
        await this.db.query(
            `
      UPDATE sessions
      SET user_id = $2, expires_at = $3, ip_address = $4,
        user_agent = $5, created_at = $6
      WHERE id = $1
      `,
            [
                session.id,
                session.userId,
                session.expiresAt,
                session.ipAddress,
                session.userAgent,
                session.createdAt
            ]
        );
    }

    async create(session: Session): Promise<void> {
        await this.db.query(
            `
      INSERT INTO sessions (
        id, user_id, expires_at, ip_address,
        user_agent, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6)
      `,
            [
                session.id,
                session.userId,
                session.expiresAt,
                session.ipAddress,
                session.userAgent,
                session.createdAt
            ]
        );
    }

    async revoke(sessionId: string, revokedAt: Date): Promise<void> {
        await this.db.query(
            `
      UPDATE sessions
      SET revoked_at = $2
      WHERE id = $1
      `,
            [sessionId, revokedAt]
        );
    }

    async revokeAllForUser(userId: string): Promise<void> {
        await this.db.query(
            `
      UPDATE sessions
      SET revoked_at = $2
      WHERE user_id = $1
      `,
            [userId]
        );
    }
}
