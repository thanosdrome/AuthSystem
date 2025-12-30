import { FastifyInstance } from 'fastify';
import { verifyMfaController } from '../controllers/mfa.controller.js';
import { container } from '../bootstrap/container.js';

export function registerMfaRoutes(app: FastifyInstance) {
    // Phase 2 of login
    app.post('/mfa/verify', async (req, reply) => {
        const body = req.body as any;
        if (!body?.mfaChallengeId || !body?.code) {
            return reply.status(400).send({ error: 'INVALID_INPUT' });
        }

        try {
            const result = await verifyMfaController({
                mfaChallengeId: body.mfaChallengeId,
                code: body.code
            });
            return reply.send(result);
        } catch (err: any) {
            return reply.status(401).send({ error: err.message });
        }
    });

    // MFA Setup (Authenticated)
    app.post('/mfa/setup', async (req, reply) => {
        // In a real app, you'd get userId from session/token
        // For now, we'll expect it in the body or assume a test user
        const body = req.body as any;
        const userId = body?.userId || 'test-user-id';

        const setup = await container.mfaService.generateSetup(userId);
        return reply.send(setup);
    });

    // MFA Enable (Confirm setup)
    app.post('/mfa/enable', async (req, reply) => {
        const body = req.body as any;
        if (!body?.userId || !body?.code) {
            return reply.status(400).send({ error: 'INVALID_INPUT' });
        }

        try {
            await container.mfaService.enable(body.userId, body.code);
            return reply.send({ success: true });
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    });
}
