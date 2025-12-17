import { FastifyInstance } from 'fastify';
import { registerController } from '../controllers/registration.controller.js';

export function registerRegisterRoutes(app: FastifyInstance) {
    app.post('/register', async (req, reply) => {
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