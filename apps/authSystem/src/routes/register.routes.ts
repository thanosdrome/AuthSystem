import { FastifyInstance } from 'fastify';
import { registerController } from '../controllers/registration.controller.js';
import { container } from '../bootstrap/container.js';

export function registerRegisterRoutes(app: FastifyInstance) {

    app.post('/register', async (req, reply) => {
        const key = `rl:register:${req.ip}`;
        const allowed = await container.rateLimitService.check(key);
        if (!allowed) {
            return reply.status(429).send({
                error: 'TOO_MANY_REQUESTS'
            });
        }
        const { email, password } = req.body as any;

        if (!email || !password) {
            return reply.status(400).send({
                error: 'INVALID_INPUT'
            });
        }

        const result = await registerController({ email, password });

        return reply.status(201).send(result);
    });
}