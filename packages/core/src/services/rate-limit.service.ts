export class RateLimitService {
    constructor(
        private readonly redis: any,
        private readonly windowSeconds: number,
        private readonly maxRequests: number
    ) { }

    async check(key: string): Promise<boolean> {
        try {
            const current = await this.redis.incr(key);

            if (current === 1) {
                await this.redis.expire(key, this.windowSeconds);
            }

            return current <= this.maxRequests;
        } catch (err: any) {
            console.warn(`[RateLimitService] Redis error: ${err.message}. Falling open.`);
            return true; // Allow request if Redis is down
        }
    }
}
