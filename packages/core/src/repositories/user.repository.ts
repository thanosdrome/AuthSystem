import { User } from '../entities/user.js';

export interface UserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(user: User): Promise<void>;
    update(user: User): Promise<void>;
    markEmailVerified(userId: string): Promise<void>;
    createOAuthUser(user: { id: string; email: string; emailVerified: boolean }): Promise<User>;
}
