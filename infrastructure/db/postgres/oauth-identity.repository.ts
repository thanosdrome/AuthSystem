import { OauthIdentityRepository } from '../../../packages/core/src/repositories/oauth-identity.repository';

export class PostgresOAuthIdentityRepository
    implements OauthIdentityRepository {

    constructor(private readonly db: any) { }

    async find(provider: string, providerUserId: string) {
        const res = await this.db.query(
            `
      SELECT user_id
      FROM oauth_identities
      WHERE provider = $1
        AND provider_user_id = $2
      `,
            [provider, providerUserId]
        );

        if (res.rows.length === 0) {
            return null;
        }

        return {
            userId: res.rows[0].user_id
        };
    }

    async create(data: {
        id: string;
        userId: string;
        provider: string;
        providerUserId: string;
        createdAt: Date;
    }) {
        await this.db.query(
            `
      INSERT INTO oauth_identities
      (id, user_id, provider, provider_user_id, created_at)
      VALUES ($1,$2,$3,$4,$5)
      `,
            [
                data.id,
                data.userId,
                data.provider,
                data.providerUserId,
                data.createdAt
            ]
        );
    }
}
