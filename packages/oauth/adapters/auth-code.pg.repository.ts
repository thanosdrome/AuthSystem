import { pool } from '../../../infrastructure/db';
import { AuthorizationCodeRepository, AuthorizationCode } from '@/oauth';

export class PostgresAuthCodeRepository
    implements AuthorizationCodeRepository {

    async create(code: AuthorizationCode): Promise<void> {
        await pool.query(
            `INSERT INTO authorization_codes VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
            [
                code.code,
                code.clientId,
                code.userId,
                code.redirectUri,
                code.scopes,
                code.expiresAt,
                code.consumedAt,
                code.createdAt
            ]
        );
    }

    async find(code: string): Promise<AuthorizationCode | null> {
        const res = await pool.query(
            'SELECT * FROM authorization_codes WHERE code=$1',
            [code]
        );
        return res.rows[0] ?? null;
    }

    async consume(code: string): Promise<void> {
        await pool.query(
            'UPDATE authorization_codes SET consumed_at=NOW() WHERE code=$1',
            [code]
        );
    }
}
