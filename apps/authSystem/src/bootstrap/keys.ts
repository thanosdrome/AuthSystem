import { generateKeyPair } from '@/crypto';

let cached: { privateKey: string; publicKey: string } | null = null;

export function loadKeys() {
    if (!cached) {
        // TEMP: replace with KMS / env / vault later
        cached = generateKeyPair();
    }
    return cached;
}
