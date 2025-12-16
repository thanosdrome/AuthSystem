import { Client } from '@/core';

export class ScopeValidator {
    static validate(client: Client, scopes: string[]) {
        const invalid = scopes.filter(s => !client.allowedScopes.includes(s));
        if (invalid.length > 0) {
            throw new Error(`Invalid scopes: ${invalid.join(', ')}`);
        }
    }
}
