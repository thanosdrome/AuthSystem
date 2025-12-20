export interface PasswordResetRepository {
    create(token: {
        id: string;
        userId: string;
        expiresAt: Date;
        createdAt: Date;
    }): Promise<void>;

    findById(id: string): Promise<{
        id: string;
        userId: string;
        expiresAt: Date;
        usedAt: Date | null;
    } | null>;

    markUsed(id: string, usedAt: Date): Promise<void>;

    deleteAllForUser(userId: string): Promise<void>;
}
