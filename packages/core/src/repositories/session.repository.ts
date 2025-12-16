import { Session } from '../entities/session.js';

export interface SessionRepository {
    findById(id: string): Promise<Session | null>;
    create(session: Session): Promise<void>;
    revoke(sessionId: string, revokedAt: Date): Promise<void>;
    revokeAllForUser(userId: string): Promise<void>;
}
