import { FastifyInstance } from 'fastify';
import { tokenController } from '../controllers/token.controller.js';

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
}
