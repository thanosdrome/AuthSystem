import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder) {
    pgm.createTable('password_reset_tokens', {
        id: { type: 'text', primaryKey: true },
        user_id: {
            type: 'text',
            notNull: true,
            references: 'users(id)',
            onDelete: 'CASCADE'
        },
        expires_at: { type: 'timestamp', notNull: true },
        used_at: { type: 'timestamp' },
        created_at: { type: 'timestamp', notNull: true }
    });

    pgm.createIndex('password_reset_tokens', ['user_id']);
}

export async function down(pgm: MigrationBuilder) {
    pgm.dropTable('password_reset_tokens');
}
