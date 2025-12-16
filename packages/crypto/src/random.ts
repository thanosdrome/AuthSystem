export { };
import crypto from 'node:crypto';

export function randomId(bytes = 32): string {
    return crypto.randomBytes(bytes).toString('hex');
}
