import { randomId } from '@/crypto';
import { UserRepository } from '../repositories/user.repository.js';
import { OauthIdentityRepository } from '../repositories/oauth-identity.repository.js';

export class OAuthService {
    constructor(
        private readonly users: UserRepository,
        private readonly identities: OauthIdentityRepository
    ) { }

    async resolveUser(
        provider: string,
        providerUserId: string,
        email: string
    ) {
        // 1. Existing OAuth identity
        const existing = await this.identities.find(
            provider,
            providerUserId
        );

        if (existing) {
            return this.users.findById(existing.userId);
        }

        // 2. Existing user by email
        let user = await this.users.findByEmail(email);

        if (!user) {
            user = await this.users.createOAuthUser({
                id: randomId(16),
                email,
                emailVerified: true
            });
        }

        // 3. Link identity
        await this.identities.create({
            id: randomId(16),
            userId: user.id,
            provider,
            providerUserId,
            createdAt: new Date()
        });

        return user;
    }
}
