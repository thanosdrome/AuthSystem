import { healthService } from '../bootstrap/container.js';

export async function readinessController() {
    return healthService.check();
}