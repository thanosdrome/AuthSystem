// infrastructure/db/migrations/002_refresh_tokens.ts
import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder) {
    pgm.createTable('refresh_tokens', {
        id: { type: 'text', primaryKey: true },
        user_id: {
            type: 'text',
            notNull: true,
            references: 'users(id)',
            onDelete: 'CASCADE'
        },
        session_id: {
            type: 'text',
            notNull: true,
            references: 'sessions(id)',
            onDelete: 'CASCADE'
        },
        expires_at: { type: 'timestamp', notNull: true },
        revoked_at: { type: 'timestamp' },
        rotated_at: { type: 'timestamp' },
        created_at: { type: 'timestamp', notNull: true }
    });
}

export async function down(pgm: MigrationBuilder) {
    pgm.dropTable('refresh_tokens');
}
