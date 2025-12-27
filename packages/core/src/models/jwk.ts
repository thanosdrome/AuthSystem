export interface Jwk {
    kty: 'RSA';
    kid: string;
    use: 'sig';
    alg: 'RS256';
    n: string;
    e: string;
}
