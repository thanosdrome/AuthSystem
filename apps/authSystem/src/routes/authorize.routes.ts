import { FastifyInstance } from 'fastify';
import { authorizeController } from '../controllers/authorize.controller.js';

export function registerAuthorizeRoutes(app: FastifyInstance) {
    app.get('/authorize', async (req, reply) => {
        const { client_id, redirect_uri, scope } = req.query as any;
        const sessionId = req.cookies.sid;

        if (!sessionId) {
            return reply.redirect('/login');
        }

        const code = await authorizeController({
            client: client_id,
            userId: 'user-1', // resolved from session later
            redirectUri: redirect_uri,
            scopes: scope.split(' ')
        });

        reply.redirect(`${redirect_uri}?code=${code}`);
    });
}
