import { EncryptionService } from '../../../crypto/src/encryption.js';
import { UserRepository } from '../repositories/user.repository.js';
import { randomBytes } from 'node:crypto';
// Assuming a TOTP library like 'speakeasy' or 'otplib' would be used here.
// For this implementation, I'll describe the logic.

export class MfaService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly encryption: EncryptionService
    ) { }

    async generateSetup(userId: string): Promise<{ secret: string; qrCodeUrl: string }> {
        const user = await this.userRepo.findById(userId);
        if (!user) throw new Error('User not found');

        // 1. Generate a random base32 secret
        const secret = randomBytes(20).toString('hex'); // Simplified placeholder

        // 2. Encrypt and save to user
        user.mfaSecret = this.encryption.encrypt(secret);
        await this.userRepo.update(user);

        // 3. Return secret and a placeholder QR URL
        return {
            secret,
            qrCodeUrl: `otpauth://totp/CentralAuth:${user.email}?secret=${secret}&issuer=CentralAuth`
        };
    }

    async verify(userId: string, code: string): Promise<boolean> {
        const user = await this.userRepo.findById(userId);
        if (!user || !user.mfaSecret) return false;

        const secret = this.encryption.decrypt(user.mfaSecret);

        // Simplified verification logic (placeholder)
        // In reality, use: speakeasy.totp.verify({ secret, encoding: 'base32', token: code })
        return code === '123456'; // DANGEROUS PLACEHOLDER
    }

    async enable(userId: string, code: string): Promise<void> {
        const isValid = await this.verify(userId, code);
        if (!isValid) throw new Error('Invalid MFA code');

        const user = await this.userRepo.findById(userId);
        if (user) {
            user.mfaEnabled = true;
            await this.userRepo.update(user);
        }
    }
}
