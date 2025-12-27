export interface OAuthStateRepository {
    create(
        state: string,
        data: { codeVerifier: string },
        ttlSeconds: number
    ): Promise<void>;

    consume(
        state: string
    ): Promise<{ codeVerifier: string } | null>;
}
