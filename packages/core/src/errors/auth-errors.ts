// packages/core/src/errors/auth.errors.ts
export class AuthError extends Error {
    constructor(
        message: string,
        public readonly code: string
    ) {
        super(message);
    }
}

export class InvalidCredentialsError extends AuthError {
    constructor() {
        super('Invalid credentials', 'INVALID_CREDENTIALS');
    }
}

export class UnauthorizedClientError extends AuthError {
    constructor() {
        super('Unauthorized client', 'UNAUTHORIZED_CLIENT');
    }
}
