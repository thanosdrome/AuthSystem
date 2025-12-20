import { randomId, hashPassword } from '@/crypto';

export class PasswordResetService {
    constructor(
        private readonly users: any,
        private readonly resetRepo: any,
        private readonly sessions: any,
        private readonly refreshTokens: any,
        private readonly ttlSeconds: number
    ) { }

    async request(email: string): Promise<string | null> {
        const user = await this.users.findByEmail(email);
        if (!user) return null;

        const token = randomId(32);

        await this.resetRepo.create({
            id: token,
            userId: user.id,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + this.ttlSeconds * 1000)
        });

        return token; // email sending happens outside
    }

    async reset(tokenId: string, newPassword: string) {
        const token = await this.resetRepo.findById(tokenId);
        if (!token || token.usedAt || token.expiresAt < new Date()) {
            throw new Error('INVALID_RESET_TOKEN');
        }

        const passwordHash = await hashPassword(newPassword);
        const now = new Date();

        await this.users.updatePassword(token.userId, passwordHash);
        await this.resetRepo.markUsed(tokenId, now);

        // revoke EVERYTHING
        await this.sessions.revokeAllForUser(token.userId, now);
        await this.refreshTokens.revokeAllForUser(token.userId);
        await this.resetRepo.deleteAllForUser(token.userId);
    }
}
