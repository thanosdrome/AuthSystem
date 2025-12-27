import { container } from '../bootstrap/container.js';

export async function verifyMfaController(input: {
    mfaChallengeId: string;
    code: string;
}) {
    // 1. Retrieve challenge from Redis
    const challengeData = await (container as any).redis.get(`mfa_challenge:${input.mfaChallengeId}`);
    if (!challengeData) {
        throw new Error('MFA challenge expired or invalid');
    }

    const { userId, sessionId } = JSON.parse(challengeData);

    // 2. Verify MFA code
    const isValid = await container.mfaService.verify(userId, input.code);
    if (!isValid) {
        throw new Error('Invalid MFA code');
    }

    // 3. Issue final tokens
    const refreshToken = await container.refreshTokenService.issue(
        userId,
        sessionId
    );

    const accessToken = container.accessTokenSigner.sign({
        sub: userId,
        sid: sessionId
    }, 15 * 60);

    // 4. Cleanup challenge
    await (container as any).redis.del(`mfa_challenge:${input.mfaChallengeId}`);

    return {
        accessToken,
        refreshToken
    };
}
