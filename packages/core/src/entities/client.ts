import { ClientType } from '../enums/client-type.js';

export interface Client {
    id: string;
    name: string;
    type: ClientType;
    secret: string;
    redirectUris: string[];
    allowedScopes: string[];
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}