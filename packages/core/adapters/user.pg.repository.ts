import { pool } from '../../../infrastructure/db';
import { UserRepository, User } from '@/core';

export class PostgresUserRepository implements UserRepository {
    async findById(id: string): Promise<User | null> {
        const res = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [id]
        );
        return res.rows[0] ?? null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const res = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return res.rows[0] ?? null;
    }

    async create(user: User): Promise<void> {
        await pool.query(
            `INSERT INTO users VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            [
                user.id,
                user.email,
                user.emailVerified,
                user.passwordHash,
                user.status,
                user.createdAt,
                user.updatedAt
            ]
        );
    }

    async update(user: User): Promise<void> {
        await pool.query(
            `UPDATE users SET
        email=$2,
        email_verified=$3,
        status=$4,
        updated_at=$5
       WHERE id=$1`,
            [
                user.id,
                user.email,
                user.emailVerified,
                user.status,
                user.updatedAt
            ]
        );
    }
    async markEmailVerified(userId: string): Promise<void> {
        await pool.query(
            `UPDATE users SET email_verified = true WHERE id = $1`,
            [userId]
        );
    }
}
