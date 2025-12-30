// infrastructure/cache/redis/client.ts
import { createClient } from 'redis';

export const redis = createClient({
    url: 'redis://localhost:6379'
});

redis.on('error', (err) => console.error('[Redis Error]:', err));
redis.on('connect', () => console.log('[Redis] Connected.'));

try {
    await redis.connect();
} catch (err) {
    console.error('[Redis] Failed to connect on startup. Continuing in degraded mode.');
}
