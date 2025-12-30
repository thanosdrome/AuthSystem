import crypto from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

export class EncryptionService {
    private keys: Map<string, Buffer> = new Map();
    private currentVersion: string;

    constructor(initialKey: Buffer | Record<string, Buffer>) {
        if (Buffer.isBuffer(initialKey)) {
            this.validateKey(initialKey);
            this.keys.set('v1', initialKey);
            this.currentVersion = 'v1';
        } else {
            const versions = Object.keys(initialKey);
            if (versions.length === 0) throw new Error('At least one key version required');
            for (const v of versions) {
                this.validateKey(initialKey[v]);
                this.keys.set(v, initialKey[v]);
            }
            this.currentVersion = versions[versions.length - 1]; // Assume last is latest
        }
    }

    private validateKey(key: Buffer) {
        if (key.length !== 32) {
            throw new Error('Master key must be 32 bytes');
        }
    }

    encrypt(text: string): string {
        const iv = crypto.randomBytes(IV_LENGTH);
        const key = this.keys.get(this.currentVersion)!;
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
        const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
        const tag = cipher.getAuthTag();

        const data = Buffer.concat([iv, tag, encrypted]).toString('base64');
        return `${this.currentVersion}:${data}`;
    }

    decrypt(ciphertext: string): string {
        // Handle legacy (no version prefix)
        if (!ciphertext.includes(':')) {
            return this.decryptWithKey(ciphertext, this.keys.get('v1')!);
        }

        const [version, data] = ciphertext.split(':');
        const key = this.keys.get(version);
        if (!key) throw new Error(`Unknown encryption version: ${version}`);

        return this.decryptWithKey(data, key);
    }

    private decryptWithKey(data: string, key: Buffer): string {
        const buffer = Buffer.from(data, 'base64');
        const iv = buffer.subarray(0, IV_LENGTH);
        const tag = buffer.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
        const encrypted = buffer.subarray(IV_LENGTH + TAG_LENGTH);

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(tag);

        return decipher.update(encrypted) + decipher.final('utf8');
    }
}
