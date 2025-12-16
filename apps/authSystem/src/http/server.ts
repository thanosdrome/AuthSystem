import Fastify from 'fastify';
import cookie from '@fastify/cookie';

import { registerLoginRoutes } from '../routes/login.routes.js';
import { registerAuthorizeRoutes } from '../routes/authorize.routes.js';
import { registerTokenRoutes } from '../routes/token.routes.js';

export async function createServer() {
    const app = Fastify({ logger: true });

    await app.register(cookie, {
        secret: process.env.COOKIE_SECRET!,
        hook: 'onRequest'
    });

    registerLoginRoutes(app);
    registerAuthorizeRoutes(app);
    registerTokenRoutes(app);

    return app;
}
