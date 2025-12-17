// infrastructure/cache/redis/email-verification.repository.ts
import { EmailVerificationRepository } from '../../../packages/core/src/repositories/email-verification.repository.js';

export class RedisEmailVerificationRepository implements EmailVerificationRepository {

    constructor(private readonly redis: any) { }

    async create(token: string, userId: string, ttl: number) {
        await this.redis.set(
            `email_verify:${token}`,
            userId,
            { EX: ttl }
        );
    }

    async consume(token: string): Promise<string | null> {
        const key = `email_verify:${token}`;
        const userId = await this.redis.get(key);
        if (!userId) return null;

        await this.redis.del(key);
        return userId;
    }
}
