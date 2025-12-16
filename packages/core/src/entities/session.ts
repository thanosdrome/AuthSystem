export interface Session {
    id: string;
    userId: string;
    deviceId?: string;
    ipAddress: string;
    userAgent: string;
    expiresAt: Date;
    revokedAt?: Date;
    createdAt: Date;
}
