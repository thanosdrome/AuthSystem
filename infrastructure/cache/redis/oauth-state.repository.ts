import { OAuthStateRepository } from '../../../packages/core/src/repositories/oauth-state.repository';

export class RedisOAuthStateRepository
    implements OAuthStateRepository {

    constructor(private readonly redis: any) { }

    async create(
        state: string,
        data: { codeVerifier: string },
        ttlSeconds: number
    ) {
        await this.redis.set(
            `oauth_state:${state}`,
            JSON.stringify(data),
            { EX: ttlSeconds }
        );
    }

    async consume(state: string) {
        const key = `oauth_state:${state}`;
        const raw = await this.redis.get(key);

        if (!raw) return null;

        await this.redis.del(key);
        return JSON.parse(raw);
    }
}
