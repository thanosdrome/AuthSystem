import { FastifyInstance } from 'fastify';
import { verifyEmailController } from '../controllers/verify.controller.js';

export function registerVerifyRoutes(app: FastifyInstance) {
    app.get('/verify-email', async (req, reply) => {
        const { token } = req.query as any;

        if (!token) {
            return reply.status(400).send({
                error: 'MISSING_TOKEN'
            });
        }

        await verifyEmailController(token);

        return reply.status(200).send({
            success: true
        });
    });
}