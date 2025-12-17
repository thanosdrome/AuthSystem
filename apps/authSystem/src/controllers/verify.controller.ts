import { container } from '../bootstrap/container.js';

export async function verifyEmailController(token: string) {
    await container.emailVerificationService.verify(token);
}