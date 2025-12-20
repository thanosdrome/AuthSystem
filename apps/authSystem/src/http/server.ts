import Fastify from 'fastify';
import cookie from '@fastify/cookie';

import { registerLoginRoutes } from '../routes/login.routes';
import { registerAuthorizeRoutes } from '../routes/authorize.routes';
import { registerTokenRoutes } from '../routes/token.routes';
import { registerRegisterRoutes } from '../routes/register.routes.js';
import { registerVerifyRoutes } from '../routes/verify.routes.js';
import { registerPasswordResetRoutes } from '../routes/password-reset.routes.js';


export async function createServer() {
    const app = Fastify({ logger: true });

    await app.register(cookie, {
        secret: process.env.COOKIE_SECRET!,
        hook: 'onRequest'
    });

    registerLoginRoutes(app);
    registerAuthorizeRoutes(app);
    registerTokenRoutes(app);
    registerRegisterRoutes(app);
    registerVerifyRoutes(app);
    registerPasswordResetRoutes(app);

    return app;
}
