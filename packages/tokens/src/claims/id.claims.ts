import { BaseClaims } from './base.claims.js';

export interface IdTokenClaims extends BaseClaims {
    type: 'id';
    email: string;
    email_verified: boolean;
}
