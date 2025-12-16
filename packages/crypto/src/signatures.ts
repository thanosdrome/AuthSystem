import crypto from 'node:crypto';

export function sign(
    data: string,
    privateKey: string
): string {
    return crypto
        .createSign('RSA-SHA256')
        .update(data)
        .sign(privateKey, 'base64');
}

export function verify(
    data: string,
    signature: string,
    publicKey: string
): boolean {
    return crypto
        .createVerify('RSA-SHA256')
        .update(data)
        .verify(publicKey, signature, 'base64');
}
