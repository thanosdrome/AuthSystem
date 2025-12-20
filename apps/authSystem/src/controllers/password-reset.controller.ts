import { passwordResetService } from '../bootstrap/container.js';

export async function requestPasswordReset(email: string) {
    const token = await passwordResetService.request(
        email.trim().toLowerCase()
    );

    if (token) {
        console.log('[PASSWORD RESET TOKEN]', token);
    }
}
export async function confirmPasswordReset(
    token: string,
    newPassword: string
) {
    await passwordResetService.reset(token, newPassword);
}
