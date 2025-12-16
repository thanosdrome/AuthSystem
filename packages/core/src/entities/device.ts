export interface Device {
    id: string;
    userId: string;
    fingerprint: string;
    trusted: boolean;
    lastSeenAt: Date;
    createdAt: Date;
}
