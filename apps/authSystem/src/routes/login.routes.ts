import { FastifyInstance } from 'fastify';
import { loginController } from '../controllers/login.controller.js';

export function registerLoginRoutes(app: FastifyInstance) {
    app.post('/login', async (req, reply) => {
        const body = req.body as any;

        if (!body?.email || !body?.password) {
            return reply.status(400).send({
                error: 'INVALID_INPUT'
            });
        }
        try {
            const result = await loginController({
                email: body.email.toLowerCase(),
                password: body.password,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent']
            });

            return reply.send(result);
        } catch (err: any) {
            console.warn(err);
            if (err.message === 'INVALID_CREDENTIALS') {
                return reply.status(401).send({
                    error: 'INVALID_CREDENTIALS'
                });
            }

            throw err; // let Fastify handle unexpected errors
        }
    });
}
