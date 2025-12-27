import { OAuthStateRepository } from '../../../packages/core/src/repositories/oauth-state.repository';

export class RedisOAuthStateRepository
    implements OAuthStateRepository {

    constructor(private readonly redis: any) { }

    async create(state: string, ttlSeconds: number) {
        await this.redis.set(
            `oauth_state:${state}`,
            '1',
            { EX: ttlSeconds }
        );
    }

    async consume(state: string): Promise<boolean> {
        const key = `oauth_state:${state}`;
        const exists = await this.redis.get(key);

        if (!exists) return false;

        await this.redis.del(key);
        return true;
    }
}
