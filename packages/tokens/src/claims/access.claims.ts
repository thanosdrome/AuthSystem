import { BaseClaims } from './base.claims.js';

export interface AccessTokenClaims extends BaseClaims {
    type: 'access';
    scope: string[];
    session_id: string;
}
