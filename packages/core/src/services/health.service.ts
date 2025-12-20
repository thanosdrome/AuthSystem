export class HealthService {
    constructor(
        private readonly db: any,
        private readonly redis: any
    ) { }

    async check() {
        await this.db.query('SELECT 1');
        await this.redis.ping();

        return {
            status: 'ready'
        };
    }
}
