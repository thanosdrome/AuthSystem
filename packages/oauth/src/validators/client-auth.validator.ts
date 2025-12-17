import { verifyPassword } from '@/crypto';
import { Client } from '@/core';

export async function validateClientSecret(
    client: Client,
    providedSecret: string
) {
    if (!client.secret) {
        throw new Error('Client has no secret');
    }

    const ok = await verifyPassword(providedSecret, client.secret);
    if (!ok) {
        throw new Error('Invalid client secret');
    }
}
