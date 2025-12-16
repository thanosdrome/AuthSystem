export interface BaseClaims {
    iss: string;      // issuer
    sub: string;      // user id
    aud: string;      // client id
    iat: number;
    exp: number;
    jti: string;
}
