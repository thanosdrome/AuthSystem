import { container } from '../bootstrap/container.js';
import { randomUUID } from 'node:crypto';

export async function loginController(input: {
    email: string;
    password: string;
    ipAddress?: string;
    userAgent?: string;
}) {
    // 1. Validate credentials
    const { user, session } = await container.authService.login({
        email: input.email,
        password: input.password,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent
    });

    // 2. Check if MFA is required
    if (user.mfaEnabled) {
        const mfaChallengeId = randomUUID();
        // Store partial session in Redis for 5 minutes
        await (container as any).redis.set(
            `mfa_challenge:${mfaChallengeId}`,
            JSON.stringify({ userId: user.id, sessionId: session.id }),
            'EX', 300
        );

        return {
            mfaRequired: true,
            mfaChallengeId
        };
    }

    // 3. Issue final tokens if no MFA
    const refreshToken = await container.refreshTokenService.issue(
        user.id,
        session.id
    );

    const accessToken = container.accessTokenSigner.sign({
        sub: user.id,
        sid: session.id
    }, 15 * 60);

    return {
        accessToken,
        refreshToken
    };
}
