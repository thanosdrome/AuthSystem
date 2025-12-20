import { container } from '../bootstrap/container.js';

export async function healthController() {
    return {
        status: 'ok',
        timestamp: new Date().toISOString()
    };
}
