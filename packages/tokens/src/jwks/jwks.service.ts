export interface JwkKey {
    kid: string;
    kty: 'RSA';
    alg: 'RS256';
    use: 'sig';
    n: string;
    e: string;
}

export class JwksService {
    constructor(private readonly keys: JwkKey[]) { }

    getJwks() {
        return { keys: this.keys };
    }
}
