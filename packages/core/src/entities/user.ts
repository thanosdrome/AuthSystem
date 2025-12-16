import { UserStatus } from '../enums/user-status.js';

export interface User {
    id: string;
    email: string;
    emailVerified: boolean;
    passwordHash: string;
    status: UserStatus;
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}
