import { Session } from '@/core/entities/session.js';
import { container } from '../bootstrap/container.js';

export async function tokenController(input: {
    code: string;
    clientId: string;
    session: Session;
    codeVerifier: string;
}) {
    return container.oauthTokenService.exchangeCode(input);
}
