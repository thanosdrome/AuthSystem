import { AuthorizationCode } from '../entities/authorization-code.js';

export interface AuthorizationCodeRepository {
    create(code: AuthorizationCode): Promise<void>;
    find(code: string): Promise<AuthorizationCode | null>;
    consume(code: string): Promise<void>;
}
