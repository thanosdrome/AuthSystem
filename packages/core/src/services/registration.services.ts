import { UserRepository } from '../repositories/user.repository.js';
import { User, UserStatus } from '../entities/user';
import { randomId, hashPassword } from '@/crypto';

export class RegistrationService {
    constructor(private readonly users: UserRepository) { }

    async register(input: {
        email: string;
        password: string;
        requireEmailVerification?: boolean;
    }): Promise<User> {
        const normalizedEmail = input.email.trim().toLowerCase();

        const existing = await this.users.findByEmail(normalizedEmail);
        if (existing) {
            throw new Error('USER_ALREADY_EXISTS');
        }

        const now = new Date();
        const emailVerified = input.requireEmailVerification === true ? false : true;

        const user: User = {
            id: randomId(16),
            email: normalizedEmail,
            emailVerified: emailVerified,
            passwordHash: await hashPassword(input.password),
            status: UserStatus.ACTIVE,
            createdAt: now,
            updatedAt: now
        };

        await this.users.create(user);
        return user;
    }
}