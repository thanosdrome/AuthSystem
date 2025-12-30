import { FastifyInstance } from 'fastify';

export function registerDiscoveryRoutes(app: FastifyInstance) {
    app.get('/.well-known/openid-configuration', async (req, reply) => {
        const issuer = process.env.ISSUER || 'http://localhost:3000';

        return {
            issuer,
            jwks_uri: `${issuer}/jwks`,
            token_endpoint: `${issuer}/oauth/token`,
            authorization_endpoint: `${issuer}/oauth/google`, // Simplified for this implementation
            registration_endpoint: `${issuer}/register`,
            userinfo_endpoint: `${issuer}/userinfo`,
            response_types_supported: ['code', 'token', 'id_token'],
            subject_types_supported: ['public'],
            id_token_signing_alg_values_supported: ['RS256'],
            scopes_supported: ['openid', 'email', 'profile'],
            token_endpoint_auth_methods_supported: ['client_secret_post', 'client_secret_basic'],
            claims_supported: ['sub', 'email', 'email_verified', 'name', 'picture']
        };
    });
}
