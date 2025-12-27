import { UserRepository } from '../../../packages/core/src/repositories/user.repository.js';
import { User } from '../../../packages/core/src/entities/user.js';

export class PostgresUserRepository implements UserRepository {
    constructor(private readonly db: any) { }
    async findById(id: string): Promise<User | null> {
        const res = await this.db.query(
            'SELECT * FROM users WHERE id = $1',
            [id]
        );
        const row = res.rows[0];
        if (!row) return null;
        return {
            id: row.id,
            email: row.email,
            passwordHash: row.password_hash,
            emailVerified: row.email_verified,
            status: row.status,
            mfaEnabled: row.mfa_enabled,
            mfaSecret: row.mfa_secret,
            backupCodes: row.backup_codes || [],
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }
    async update(user: User): Promise<void> {
        await this.db.query(
            `
      UPDATE users
      SET email = $2, email_verified = $3, password_hash = $4, status = $5,
          mfa_enabled = $6, mfa_secret = $7, backup_codes = $8, updated_at = $9
      WHERE id = $1
      `,
            [
                user.id,
                user.email,
                user.emailVerified,
                user.passwordHash,
                user.status,
                user.mfaEnabled,
                user.mfaSecret,
                user.backupCodes,
                user.updatedAt
            ]
        );
    }

    async findByEmail(email: string): Promise<User | null> {
        const res = await this.db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        const row = res.rows[0];
        if (!row) return null;

        return {
            id: row.id,
            email: row.email,
            passwordHash: row.password_hash,
            emailVerified: row.email_verified,
            status: row.status,
            mfaEnabled: row.mfa_enabled,
            mfaSecret: row.mfa_secret,
            backupCodes: row.backup_codes || [],
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }

    async create(user: User): Promise<void> {
        await this.db.query(
            `
      INSERT INTO users (
        id, email, email_verified, password_hash, status,
        mfa_enabled, mfa_secret, backup_codes,
        created_at, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      `,
            [
                user.id,
                user.email,
                user.emailVerified,
                user.passwordHash,
                user.status,
                user.mfaEnabled,
                user.mfaSecret,
                user.backupCodes,
                user.createdAt,
                user.updatedAt
            ]
        );
    }

    async markEmailVerified(userId: string): Promise<void> {
        await this.db.query(
            `
    UPDATE users
    SET email_verified = true,
        status = 'ACTIVE',
        updated_at = NOW()
    WHERE id = $1
    `,
            [userId]
        );
    }

    async createOAuthUser(data: { id: string; email: string; emailVerified: boolean }): Promise<User> {
        const user: User = {
            id: data.id,
            email: data.email,
            emailVerified: data.emailVerified,
            passwordHash: '', // No password hash for OAuth users
            status: 'ACTIVE' as any,
            mfaEnabled: false,
            backupCodes: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await this.create(user);
        return user;
    }
}
