import { KeyRepository, CryptographicKey } from '../../../packages/core/src/repositories/key.repository.js';

export class PostgresKeyRepository implements KeyRepository {
    constructor(private readonly db: any) { }

    async findById(kid: string): Promise<CryptographicKey | null> {
        const res = await this.db.query(
            'SELECT * FROM cryptographic_keys WHERE kid = $1',
            [kid]
        );
        const row = res.rows[0];
        if (!row) return null;
        return this.mapToEntity(row);
    }

    async findAllValid(): Promise<CryptographicKey[]> {
        const res = await this.db.query(
            "SELECT * FROM cryptographic_keys WHERE status IN ('ACTIVE', 'RETIRED') ORDER BY created_at DESC"
        );
        return res.rows.map((row: any) => this.mapToEntity(row));
    }

    async getActiveKey(): Promise<CryptographicKey | null> {
        const res = await this.db.query(
            "SELECT * FROM cryptographic_keys WHERE status = 'ACTIVE' LIMIT 1"
        );
        const row = res.rows[0];
        if (!row) return null;
        return this.mapToEntity(row);
    }

    async create(key: CryptographicKey): Promise<void> {
        await this.db.query(
            `INSERT INTO cryptographic_keys (kid, private_key_enc, public_key_pem, status, created_at)
             VALUES ($1, $2, $3, $4, $5)`,
            [key.kid, key.privateKeyEnc, key.publicKeyPem, key.status, key.createdAt]
        );
    }

    async update(key: CryptographicKey): Promise<void> {
        await this.db.query(
            `UPDATE cryptographic_keys 
             SET status = $2, activated_at = $3, retired_at = $4
             WHERE kid = $1`,
            [key.kid, key.status, key.activatedAt, key.retiredAt]
        );
    }

    private mapToEntity(row: any): CryptographicKey {
        return {
            kid: row.kid,
            privateKeyEnc: row.private_key_enc,
            publicKeyPem: row.public_key_pem,
            status: row.status,
            createdAt: row.created_at,
            activatedAt: row.activated_at,
            retiredAt: row.retired_at
        };
    }
}
