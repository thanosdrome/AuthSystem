// packages/core/src/repositories/email-verification.repository.ts
export interface EmailVerificationRepository {
    create(token: string, userId: string, ttlSeconds: number): Promise<void>;
    consume(token: string): Promise<string | null>;
}
