import { Session } from '@/core';
import { container } from '../bootstrap/container.js';

export async function tokenController(input: {
    code: string;
    clientId: string;
    session: Session;
    codeVerifier: string;
}) {
    return container.oauthTokenService.exchangeCode(input);
}

export async function refreshTokenController(token: string) {
    return container.refreshTokenService.rotate(token);
}
