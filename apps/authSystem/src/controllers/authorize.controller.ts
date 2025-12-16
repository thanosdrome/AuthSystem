import { Client } from '@/core/entities/client.js';
import { container } from '../bootstrap/container.js';

export async function authorizeController(input: {
    client: Client;
    userId: string;
    redirectUri: string;
    scopes: string[];
}) {
    return container.authorizationService.authorize(input);
}
