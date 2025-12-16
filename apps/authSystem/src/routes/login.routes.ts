import { FastifyInstance } from 'fastify';
import { loginController } from '../controllers/login.controller.js';

export function registerLoginRoutes(app: FastifyInstance) {
    app.post('/login', async (req, reply) => {
        const { email, password } = req.body as any;

        const session = await loginController(email, password, {
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'] ?? 'unknown'
        });

        reply
            .setCookie('sid', session.id, {
                httpOnly: true,
                sameSite: 'lax',
                path: '/'
            })
            .send({ success: true });
    });
}
