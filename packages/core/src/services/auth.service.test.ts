import { describe, it, expect } from 'vitest';
import { AuthService } from './auth.service.js';
import { UserStatus } from '../enums/user-status.js';
import { verifyPassword, hashPassword } from '@/crypto/index.js';

const userRepo = {
    findById: async (id: string) => ({
        id,
        email: 'test@example.com',
        emailVerified: true,
        passwordHash: await hashPassword('secret'),
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date()
    })
};

const sessionRepo = {
    create: async () => { },
};

describe('AuthService.authenticate', () => {
    it('rejects invalid password', async () => {
        const service = new AuthService(userRepo as any, sessionRepo as any);

        await expect(
            service.authenticate(
                'user-1',
                false,
                { ipAddress: '1.1.1.1', userAgent: 'test' }
            )
        ).rejects.toThrow();
    });

    it('creates session for valid user', async () => {
        const service = new AuthService(userRepo as any, sessionRepo as any);

        const session = await service.authenticate(
            'user-1',
            true,
            { ipAddress: '1.1.1.1', userAgent: 'test' }
        );

        expect(session.userId).toBe('user-1');
        expect(session.expiresAt).toBeInstanceOf(Date);
    });
});
