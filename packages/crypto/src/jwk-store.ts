import fs from 'fs';
import path from 'path';
import { generateKeyPairSync, randomUUID } from 'crypto';

const KEY_DIR = path.resolve('infrastructure/keys');
const PRIVATE_KEY_PATH = path.join(KEY_DIR, 'jwk-private.pem');
const PUBLIC_KEY_PATH = path.join(KEY_DIR, 'jwk-public.pem');
const META_PATH = path.join(KEY_DIR, 'jwk-meta.json');

export function loadOrCreateRsaKey() {
    try {
        if (
            fs.existsSync(PRIVATE_KEY_PATH) &&
            fs.existsSync(PUBLIC_KEY_PATH) &&
            fs.existsSync(META_PATH) &&
            fs.statSync(PRIVATE_KEY_PATH).size > 0 &&
            fs.statSync(PUBLIC_KEY_PATH).size > 0 &&
            fs.statSync(META_PATH).size > 0
        ) {
            const meta = JSON.parse(fs.readFileSync(META_PATH, 'utf8'));

            console.log('[JWKS] Loading existing keys from disk...');
            return {
                kid: meta.kid,
                privateKey: fs.readFileSync(PRIVATE_KEY_PATH, 'utf8'),
                publicKey: fs.readFileSync(PUBLIC_KEY_PATH, 'utf8')
            };
        }
    } catch (err) {
        console.warn('[JWKS] Failed to load keys, regenerating...', err);
    }

    // Generate new key (first boot only)
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
    });

    const kid = randomUUID();

    fs.mkdirSync(KEY_DIR, { recursive: true });
    fs.writeFileSync(PRIVATE_KEY_PATH, privateKey);
    fs.writeFileSync(PUBLIC_KEY_PATH, publicKey);
    fs.writeFileSync(META_PATH, JSON.stringify({ kid }, null, 2));

    return { kid, publicKey, privateKey };
}
