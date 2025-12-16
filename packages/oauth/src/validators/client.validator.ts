import { Client } from '@/core';

export class ClientValidator {
    static validateRedirectUri(client: Client, redirectUri: string) {
        if (!client.redirectUris.includes(redirectUri)) {
            throw new Error('Invalid redirect URI');
        }
    }
}
