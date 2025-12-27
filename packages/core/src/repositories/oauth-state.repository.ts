export interface OAuthStateRepository {
    create(state: string, ttlSeconds: number): Promise<void>;
    consume(state: string): Promise<boolean>;
}
