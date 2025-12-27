export interface OauthIdentityRepository {
    find(provider: string, providerUserId: string): Promise<{
        userId: string;
    } | null>;

    create(data: {
        id: string;
        userId: string;
        provider: string;
        providerUserId: string;
        createdAt: Date;
    }): Promise<void>;
}
