import { UserStatus } from "../enums/user-status";

export interface User {
    id: string;
    email: string;
    emailVerified: boolean;
    passwordHash: string;
    status: UserStatus;
    mfaEnabled: boolean;
    mfaSecret?: string;
    backupCodes: string[];
    createdAt: Date;
    updatedAt: Date;
}
export { UserStatus };