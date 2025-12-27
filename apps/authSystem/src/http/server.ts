import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';

import { registerLoginRoutes } from '../routes/login.routes';
import { registerAuthorizeRoutes } from '../routes/authorize.routes';
import { registerTokenRoutes } from '../routes/token.routes';
import { registerRegisterRoutes } from '../routes/register.routes.js';
import { registerVerifyRoutes } from '../routes/verify.routes.js';
import { registerPasswordResetRoutes } from '../routes/password-reset.routes.js';
import { registerJwksRoutes } from '../routes/jwks.route';
import { registerHealthRoutes } from '../routes/health.routes';
import { registerOAuthRoutes } from '../routes/oauth.routes.js';



export async function createServer() {
    const required = [
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'GOOGLE_REDIRECT_URI'
    ];

    for (const key of required) {
        if (!process.env[key]) {
            throw new Error(`Missing env: ${key}`);
        }
    }
    const app = Fastify({ logger: true });

    await app.register(cookie, {
        secret: process.env.COOKIE_SECRET!,
        hook: 'onRequest'
    });

    await app.register(cors, {
        origin: [process.env.FRONTEND_URL || 'http://localhost:3001'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    });

    registerLoginRoutes(app);
    registerAuthorizeRoutes(app);
    registerTokenRoutes(app);
    registerRegisterRoutes(app);
    registerVerifyRoutes(app);
    registerPasswordResetRoutes(app);
    registerJwksRoutes(app);
    registerHealthRoutes(app);
    registerOAuthRoutes(app);


    return app;
}
