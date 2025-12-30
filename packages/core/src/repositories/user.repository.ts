import { User } from '../entities/user.js';

export interface UserRepository {
    findById(id: string, tx?: any): Promise<User | null>;
    findByEmail(email: string, tx?: any): Promise<User | null>;
    create(user: User, tx?: any): Promise<void>;
    update(user: User, tx?: any): Promise<void>;
    markEmailVerified(userId: string, tx?: any): Promise<void>;
    createOAuthUser(user: { id: string; email: string; emailVerified: boolean }, tx?: any): Promise<User>;
}
