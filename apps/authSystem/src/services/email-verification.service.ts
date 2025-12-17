// apps/authSystem/src/services/email-verification.service.ts
import { randomId } from '@/crypto';
import {
    EmailVerificationRepository
} from '../../../../packages/core/src/repositories/email-verification.repository.js';
import { UserRepository } from '../../../../packages/core/src/repositories/user.repository.js';

export class EmailVerificationService {
    constructor(
        private readonly repo: EmailVerificationRepository,
        private readonly users: UserRepository,
        private readonly ttlSeconds: number
    ) { }

    async issue(userId: string): Promise<string> {
        const token = randomId(32);
        await this.repo.create(token, userId, this.ttlSeconds);
        console.log(token);
        return token;
    }

    async verify(token: string): Promise<void> {
        const userId = await this.repo.consume(token);
        if (!userId) {
            throw new Error('INVALID_OR_EXPIRED_TOKEN');
        }

        await this.users.markEmailVerified(userId);
    }
}
