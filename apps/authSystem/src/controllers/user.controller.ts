import { container } from '../bootstrap/container.js';

export async function getProfileController(userId: string) {
    const user = await container.userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    return {
        id: user.id,
        email: user.email,
        mfaEnabled: user.mfaEnabled,
        emailVerified: user.emailVerified,
        status: user.status
    };
}
