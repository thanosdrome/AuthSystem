import { container } from '../bootstrap/container.js';

export async function loginController(
    email: string,
    password: string,
    context: { ipAddress: string; userAgent: string }
) {
    // TEMP: password validation stub
    const passwordValid = password === 'password';

    return container.authService.authenticate(
        email,
        passwordValid,
        context
    );
}
