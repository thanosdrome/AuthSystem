export interface CryptographicKey {
    kid: string;
    privateKeyEnc: string;
    publicKeyPem: string;
    status: 'PENDING' | 'ACTIVE' | 'RETIRED';
    createdAt: Date;
    activatedAt?: Date;
    retiredAt?: Date;
}

export interface KeyRepository {
    findById(kid: string): Promise<CryptographicKey | null>;
    findAllValid(): Promise<CryptographicKey[]>;
    getActiveKey(): Promise<CryptographicKey | null>;
    create(key: CryptographicKey): Promise<void>;
    update(key: CryptographicKey): Promise<void>;
}
