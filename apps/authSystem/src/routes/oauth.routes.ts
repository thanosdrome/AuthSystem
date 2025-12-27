import 'dotenv/config';
import axios from 'axios';
import { container, oauthService, accessTokenSigner, oauthStateRepository } from '../bootstrap/container.js';
import { FastifyInstance } from 'fastify';
import crypto from 'node:crypto';

function generateState() {
    return crypto.randomBytes(32).toString('hex');
}

export async function registerOAuthRoutes(app: FastifyInstance) {

    /**
     * Redirect to Google
     */
    app.get('/oauth/google', async (req, reply) => {
        const state = generateState();

        await oauthStateRepository.create(
            state,
            300
        );

        const params = new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID!,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
            response_type: 'code',
            scope: 'openid email profile',
            // access_type: 'offline',
            // prompt: 'consent',
            state
        });

        reply.redirect(
            `https://accounts.google.com/o/oauth2/v2/auth?${params}`
        );
    });

    /**
     * Google OAuth callback
     */
    app.get('/oauth/google/callback', async (req, reply) => {
        const { code, state } = req.query as { code?: string, state?: string };

        if (!code || !state) {
            return reply.status(400).send({ error: 'MISSING_OAUTH_RESPONSE' });
        }

        const stateValid = await oauthStateRepository.consume(state);
        if (!stateValid) {
            return reply.status(403).send({ error: 'INVALID_OAUTH_STATE' });
        }
        /**
         * Exchange code for Google access token
         */
        const tokenRes = await axios.post(
            'https://oauth2.googleapis.com/token',
            {
                code,
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
                grant_type: 'authorization_code'
            },
            { headers: { 'Content-Type': 'application/json' } }
        );

        const googleAccessToken = tokenRes.data.access_token;

        /**
         * Fetch Google user info
         */
        const userRes = await axios.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            {
                headers: {
                    Authorization: `Bearer ${googleAccessToken}`
                }
            }
        );

        const {
            id: googleUserId,
            email,
            verified_email
        } = userRes.data;

        if (!verified_email) {
            return reply.status(403).send({
                error: 'EMAIL_NOT_VERIFIED'
            });
        }

        /**
         * Resolve local user
         */
        const user = await oauthService.resolveUser(
            'google',
            googleUserId,
            email
        );

        /**
         * Create session
         */
        const { session } = await container.authService.loginOAuth(
            user!.id,
            {
                ip: req.ip,
                userAgent: req.headers['user-agent']
            }
        );

        /**
         * Issue tokens
         */
        const refreshToken =
            await container.refreshTokenService.issue(
                user!.id,
                session.id
            );

        const accessToken =
            accessTokenSigner.sign({
                sub: user!.id,
                sid: session.id
            });

        /**
         * Redirect to frontend
         */
        const redirectUrl =
            `${process.env.FRONTEND_URL}/oauth/callback` +
            `#accessToken=${accessToken}` +
            `&refreshToken=${refreshToken}`;

        reply.redirect(redirectUrl);
    });
}
