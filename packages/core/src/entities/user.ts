import { UserStatus } from "../enums/user-status";

export interface User {
    id: string;
    email: string;
    emailVerified: boolean;
    passwordHash: string;
    status: UserStatus;
    createdAt: Date;
    updatedAt: Date;
}
export { UserStatus };