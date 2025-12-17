// infrastructure/db/postgres/client.ts
import pg from 'pg';

export const pgPool = new pg.Pool({
    host: 'localhost',
    port: 5432,
    user: 'auth',
    password: 'auth',
    database: 'auth'
});
