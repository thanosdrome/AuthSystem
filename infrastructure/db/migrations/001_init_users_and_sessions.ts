// infrastructure/db/migrations/001_init_users_and_sessions.ts
import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder) {
    pgm.createTable('users', {
        id: { type: 'text', primaryKey: true },
        email: { type: 'text', notNull: true, unique: true },
        email_verified: { type: 'boolean', notNull: true },
        password_hash: { type: 'text', notNull: true },
        status: { type: 'text', notNull: true },
        created_at: { type: 'timestamp', notNull: true },
        updated_at: { type: 'timestamp', notNull: true }
    });

    pgm.createTable('sessions', {
        id: { type: 'text', primaryKey: true },
        user_id: {
            type: 'text',
            notNull: true,
            references: 'users(id)'
        },
        expires_at: { type: 'timestamp', notNull: true },
        ip_address: { type: 'text' },
        user_agent: { type: 'text' },
        created_at: { type: 'timestamp', notNull: true },
        revoked_at: { type: 'timestamp' }
    });
}

export async function down(pgm: MigrationBuilder) {
    pgm.dropTable('sessions');
    pgm.dropTable('users');
}
