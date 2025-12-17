import { container } from '../bootstrap/container.js';

export async function registerController(input: {
    email: string;
    password: string;
}) {
    const user = await container.registrationService.register({
        email: input.email,
        password: input.password,
        requireEmailVerification: true
    });

    let token: string | undefined;
    try {
        token = await container.emailVerificationService.issue(user.id);
        console.log(
            `Verify email: ${process.env.APP_BASE_URL}/verify-email?token=${token}`
        );
    } catch (err) {
        throw err;
    }

    return {
        id: user.id,
        email: user.email,
        status: user.status,
        verificationTokenIssued: !!token
    };
}