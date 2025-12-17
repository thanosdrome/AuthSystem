import { UserRepository } from '../repositories/user.repository';
import { SessionRepository } from '../repositories/session.repository';
import { verifyPassword } from '@/crypto';
import { randomId } from '@/crypto';
import { UserStatus } from '../entities/user';

export class AuthService {
    constructor(
        private readonly users: UserRepository,
        private readonly sessions: SessionRepository
    ) { }

    async login(input: {
        email: string;
        password: string;
        ipAddress?: string;
        userAgent?: string;
    }) {
        const user = await this.users.findByEmail(input.email.toLowerCase());

        // Generic failure — do NOT reveal which part failed
        if (!user || user.status !== UserStatus.ACTIVE) {
            throw new Error('INVALID_CREDENTIALS');
        }

        const valid = await verifyPassword(
            input.password,
            user.passwordHash
        );

        if (!valid) {
            throw new Error('INVALID_CREDENTIALS');
        }

        const session = {
            id: randomId(16),
            userId: user.id,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
            ipAddress: input.ipAddress!,
            userAgent: input.userAgent!
        };

        await this.sessions.create(session);

        return { user, session };
    }
}
