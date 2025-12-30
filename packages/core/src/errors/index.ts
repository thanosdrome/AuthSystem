export enum ErrorCode {
    INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
    INVALID_INPUT = 'AUTH_INVALID_INPUT',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    MFA_REQUIRED = 'MFA_REQUIRED',
    MFA_INVALID_CODE = 'MFA_INVALID_CODE',
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
    OAUTH_EXCHANGE_FAILED = 'OAUTH_EXCHANGE_FAILED',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    SESSION_EXPIRED = 'SESSION_EXPIRED'
}

export class AppError extends Error {
    constructor(
        public readonly code: ErrorCode,
        public readonly statusCode: number = 400,
        message?: string
    ) {
        super(message || code);
        this.name = 'AppError';
    }
}
