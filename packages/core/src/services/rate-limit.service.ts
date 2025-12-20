export class RateLimitService {
    constructor(
        private readonly redis: any,
        private readonly windowSeconds: number,
        private readonly maxRequests: number
    ) { }

    async check(key: string): Promise<boolean> {
        const current = await this.redis.incr(key);

        if (current === 1) {
            await this.redis.expire(key, this.windowSeconds);
        }

        return current <= this.maxRequests;
    }
}
