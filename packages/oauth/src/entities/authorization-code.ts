export interface AuthorizationCode {
    code: string;
    clientId: string;
    userId: string;
    redirectUri: string;
    scopes: string[];

    // PKCE
    codeChallenge?: string;
    codeChallengeMethod?: 'S256';

    expiresAt: Date;
    consumedAt?: Date;
    createdAt: Date;
}
