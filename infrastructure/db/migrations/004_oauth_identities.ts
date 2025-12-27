import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder) {
    pgm.createTable('oauth_identities', {
        id: { type: 'text', primaryKey: true },
        user_id: {
            type: 'text',
            notNull: true,
            references: 'users(id)',
            onDelete: 'CASCADE'
        },
        provider: { type: 'text', notNull: true },
        provider_user_id: { type: 'text', notNull: true },
        created_at: { type: 'timestamp', notNull: true }
    });

    pgm.createIndex('oauth_identities', ['provider', 'provider_user_id'], {
        unique: true
    });
}

export async function down(pgm: MigrationBuilder) {
    pgm.dropTable('oauth_identities');
}
