import { FastifyInstance } from 'fastify';
import { authenticate } from '../http/hooks.js';
import { getProfileController } from '../controllers/user.controller.js';

export function registerUserRoutes(app: FastifyInstance) {
    app.get('/me', { preHandler: authenticate }, async (req, reply) => {
        const userId = (req as any).user.id;
        const profile = await getProfileController(userId);
        return reply.send(profile);
    });
}
