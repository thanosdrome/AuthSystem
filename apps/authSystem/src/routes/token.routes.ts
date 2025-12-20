import { FastifyInstance } from 'fastify';
import { tokenController, refreshTokenController } from '../controllers/token.controller.js';
import { container } from '../bootstrap/container.js';

export function registerTokenRoutes(app: FastifyInstance) {
    app.post('/token', async (req) => {
        const { code, client_id, code_verifier } = req.body as {
            code: string;
            client_id: string;
            code_verifier: string;
        };

        return tokenController({
            code,
            clientId: client_id,
            session: {
                id: 'auth-code',
                userId: 'user-1',
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
                createdAt: new Date(),
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'] ?? 'unknown'
            },
            codeVerifier: code_verifier
        });
    });

    app.post('/token/refresh', async (req, res) => {
        const key = `rl:refresh:${req.ip}`;
        const allowed = await container.rateLimitService.check(key);
        if (!allowed) {
            return res.status(429).send({
                error: 'TOO_MANY_REQUESTS'
            });
        }
        const { refreshToken } = req.body as { refreshToken: string };
        return refreshTokenController(refreshToken);
    });
}
