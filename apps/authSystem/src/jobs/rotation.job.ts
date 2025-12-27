import { container } from '../bootstrap/container.js';

export async function runKeyRotation() {
    console.log('[JOBS] Starting key rotation...');
    try {
        await container.keyManagerService.rotate();
        console.log('[JOBS] Key rotation successful.');
    } catch (error) {
        console.error('[JOBS] Key rotation failed:', error);
    }
}

// In a real system, this would be hooked into a scheduler (cron node-cron, etc.)
// Or called via a CLI command
if (process.env.TRIGGER_ROTATION === 'true') {
    runKeyRotation();
}
