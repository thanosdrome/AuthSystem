import { container } from '../bootstrap/container.js';


export async function loginController(input: {
    email: string;
    password: string;
    ipAddress?: string;
    userAgent?: string;
}) {
    const { user, session } = await container.authService.login({
        email: input.email,
        password: input.password,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent
    });

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
