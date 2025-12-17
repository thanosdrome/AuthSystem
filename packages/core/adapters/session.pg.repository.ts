import { pool } from '../../../infrastructure/db';
import { SessionRepository, Session } from '@/core';

export class PostgresSessionRepository implements SessionRepository {
    async findById(id: string): Promise<Session | null> {
        const res = await pool.query(
            'SELECT * FROM sessions WHERE id=$1',
            [id]
        );
        return res.rows[0] ?? null;
    }

    async create(session: Session): Promise<void> {
        await pool.query(
            `INSERT INTO sessions VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            [
                session.id,
                session.userId,
                session.ipAddress,
                session.userAgent,
                session.expiresAt,
                session.revokedAt,
                session.createdAt
            ]
        );
    }

    async revoke(sessionId: string, revokedAt: Date): Promise<void> {
        await pool.query(
            'UPDATE sessions SET revoked_at=$2 WHERE id=$1',
            [sessionId, revokedAt]
        );
    }

    async revokeAllForUser(userId: string): Promise<void> {
        await pool.query(
            'UPDATE sessions SET revoked_at=NOW() WHERE user_id=$1',
            [userId]
        );
    }
}
