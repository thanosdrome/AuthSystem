import { FastifyInstance } from 'fastify';
import {
    requestPasswordReset,
    confirmPasswordReset
} from '../controllers/password-reset.controller.js';

export async function registerPasswordResetRoutes(app: FastifyInstance) {

    /**
     * Request password reset
     * POST /password/reset/request
     */
    app.post('/password/reset/request', async (req, reply) => {
        const body = req.body as {
            email?: string;
        };

        if (
            typeof body?.email !== 'string' ||
            body.email.trim().length === 0
        ) {
            return reply.status(400).send({
                error: 'INVALID_INPUT'
            });
        }

        // Always return success (no user enumeration)
        await requestPasswordReset(body.email);

        return reply.send({
            status: 'ok'
        });
    });

    /**
     * Confirm password reset
     * POST /password/reset/confirm
     */
    app.post('/password/reset/confirm', async (req, reply) => {
        const body = req.body as {
            token?: string;
            password?: string;
        };

        if (
            typeof body?.token !== 'string' ||
            body.token.length === 0 ||
            typeof body?.password !== 'string' ||
            body.password.length < 8
        ) {
            return reply.status(400).send({
                error: 'INVALID_INPUT'
            });
        }

        try {
            await confirmPasswordReset(
                body.token,
                body.password
            );

            return reply.send({
                status: 'ok'
            });
        } catch (err: any) {
            if (err.message === 'INVALID_RESET_TOKEN') {
                return reply.status(400).send({
                    error: 'INVALID_RESET_TOKEN'
                });
            }

            throw err;
        }
    });
}
