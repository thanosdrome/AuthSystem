import { AuthorizationCode, AuthorizationCodeRepository } from '../../../packages/oauth';

export class RedisAuthorizationCodeRepository
    implements AuthorizationCodeRepository {

    constructor(private readonly redis: any) { }
    create(code: AuthorizationCode): Promise<void> {
        throw new Error('Method not implemented.');
    }
    find(code: string): Promise<AuthorizationCode | null> {
        throw new Error('Method not implemented.');
    }

    async store(code: string, payload: any, ttlSeconds: number) {
        await this.redis.set(
            `auth_code:${code}`,
            JSON.stringify(payload),
            { EX: ttlSeconds }
        );
    }

    async consume(code: string): Promise<any | null> {
        const key = `auth_code:${code}`;
        const data = await this.redis.get(key);
        if (!data) return null;
        await this.redis.del(key);
        return JSON.parse(data);
    }
}