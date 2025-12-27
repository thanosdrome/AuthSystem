import { generateKeyPair } from '../../../crypto/src/keys.js';
import { EncryptionService } from '../../../crypto/src/encryption.js';
import { KeyRepository, CryptographicKey } from '../../../core/src/repositories/key.repository.js';
import { randomUUID } from 'node:crypto';

export class KeyManagerService {
    constructor(
        private readonly keyRepo: KeyRepository,
        private readonly encryption: EncryptionService
    ) { }

    async rotate(): Promise<void> {
        // 1. Generate new key pair
        const { publicKey, privateKey } = generateKeyPair();
        const kid = randomUUID();

        // 2. Encrypt private key
        const privateKeyEnc = this.encryption.encrypt(privateKey);

        // 3. Create new PENDING key
        const newKey: CryptographicKey = {
            kid,
            privateKeyEnc,
            publicKeyPem: publicKey,
            status: 'PENDING',
            createdAt: new Date(),
        };
        await this.keyRepo.create(newKey);

        // 4. Retire current ACTIVE key
        const activeKey = await this.keyRepo.getActiveKey();
        if (activeKey) {
            activeKey.status = 'RETIRED';
            activeKey.retiredAt = new Date();
            await this.keyRepo.update(activeKey);
        }

        // 5. Activate NEW key
        newKey.status = 'ACTIVE';
        newKey.activatedAt = new Date();
        await this.keyRepo.update(newKey);
    }

    async getSigningKey(): Promise<{ kid: string; privateKey: string } | null> {
        const activeKey = await this.keyRepo.getActiveKey();
        if (!activeKey) return null;

        return {
            kid: activeKey.kid,
            privateKey: this.encryption.decrypt(activeKey.privateKeyEnc)
        };
    }

    async getVerificationKeys(): Promise<CryptographicKey[]> {
        return this.keyRepo.findAllValid();
    }
}
