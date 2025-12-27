import { FastifyInstance } from 'fastify';
import { keyStore } from '../bootstrap/container.js';

export async function registerJwksRoutes(app: FastifyInstance) {
    app.get('/jwks', async () => {
        return keyStore.getJwks();
    });
}
