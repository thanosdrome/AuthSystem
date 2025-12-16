import { UserRepository } from '../repositories/user.repository.js';
import { SessionRepository } from '../repositories/session.repository.js';
import { UserStatus } from '../enums/user-status.js';
import { Session } from '../entities/session.js';

export class AuthService {
    private users: UserRepository;
    private sessions: SessionRepository;

    constructor(users: UserRepository, sessions: SessionRepository) {
        this.users = users;
        this.sessions = sessions;
    }

    async authenticate(
        userId: string,
        passwordValid: boolean,
        context: {
            ipAddress: string;
            userAgent: string;
            deviceId?: string;
        }
    ): Promise<Session> {
        const user = await this.users.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        if (user.status !== UserStatus.ACTIVE) {
            throw new Error('User is not allowed to authenticate');
        }

        if (!passwordValid) {
            throw new Error('Invalid credentials');
        }

        const session: Session = {
            id: crypto.randomUUID(),
            userId: user.id,
            deviceId: context.deviceId,
            ipAddress: context.ipAddress,
            userAgent: context.userAgent,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
            createdAt: new Date()
        };

        await this.sessions.create(session);
        return session;
    }
}
