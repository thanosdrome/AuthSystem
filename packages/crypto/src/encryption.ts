import crypto from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

export class EncryptionService {
    constructor(private readonly masterKey: Buffer) {
        if (masterKey.length !== 32) {
            throw new Error('Master key must be 32 bytes');
        }
    }

    encrypt(text: string): string {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, this.masterKey, iv);
        const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
        const tag = cipher.getAuthTag();

        return Buffer.concat([iv, tag, encrypted]).toString('base64');
    }

    decrypt(ciphertext: string): string {
        const buffer = Buffer.from(ciphertext, 'base64');
        const iv = buffer.subarray(0, IV_LENGTH);
        const tag = buffer.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
        const encrypted = buffer.subarray(IV_LENGTH + TAG_LENGTH);

        const decipher = crypto.createDecipheriv(ALGORITHM, this.masterKey, iv);
        decipher.setAuthTag(tag);

        return decipher.update(encrypted) + decipher.final('utf8');
    }
}
