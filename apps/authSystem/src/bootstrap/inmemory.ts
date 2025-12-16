import { User, Session } from '@/core/index.js';
import { UserRepository } from '@/core/repositories/user.repository.js';
import { SessionRepository } from '@/core/repositories/session.repository.js';
import {
    AuthorizationCode
} from '@/oauth/entities/authorization-code.js';
import { AuthorizationCodeRepository } from '@/oauth/repositories/authorization-code.repository.js';
export class InMemoryUserRepo implements UserRepository {
    private users: Map<string, User> = new Map();
    async findById(id: string): Promise<User | null> {
        return this.users.get(id) || null;
    }
    async findByEmail(email: string): Promise<User | null> {
        for (const user of this.users.values()) {
            if (user.email === email) return user;
        }
        return null;
    }
    async create(user: User): Promise<void> {
        this.users.set(user.id, user);
    }
    async update(user: User): Promise<void> {
        if (!this.users.has(user.id)) {
            throw new Error('User not found');
        }
        this.users.set(user.id, user);
    }
}
export class InMemorySessionRepo implements SessionRepository {
    private sessions: Map<string, Session> = new Map();
    async findById(id: string): Promise<Session | null> {
        return this.sessions.get(id) || null;
    }
    async create(session: Session): Promise<void> {
        this.sessions.set(session.id, session);
    }
    async revoke(sessionId: string, revokedAt: Date): Promise<void> {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.revokedAt = revokedAt;
            this.sessions.set(sessionId, session);
        }
    }
    async revokeAllForUser(userId: string): Promise<void> {
        for (const session of this.sessions.values()) {
            if (session.userId === userId) {
                session.revokedAt = new Date();
            }
        }
    }
}
export class InMemoryAuthCodeRepo implements AuthorizationCodeRepository {
    private codes: Map<string, AuthorizationCode> = new Map();
    async create(code: AuthorizationCode): Promise<void> {
        this.codes.set(code.code, code);
    }
    async find(code: string): Promise<AuthorizationCode | null> {
        return this.codes.get(code) || null;
    }
    async consume(code: string): Promise<void> {
        const authCode = this.codes.get(code);
        if (authCode) {
            authCode.consumedAt = new Date();
        }
    }
}
