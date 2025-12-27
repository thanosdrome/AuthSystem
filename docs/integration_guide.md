# DeCentralAuth Developer Integration Guide

This guide is for backend engineers building services that consume DeCentralAuth tokens. 

## 1. Public Key Discovery (JWKS)

Consumer services should never have access to the private signing key. Instead, they must verify tokens using the public key exposed via the JWKS endpoint.

- **Endpoint**: `GET /jwks.json`
- **Caching**: Services should cache the JWKS response to avoid a network round-trip for every request. Refresh the cache only if verification fails with an unknown key ID (`kid`).

## 2. JWT Verification Logic

When your service receives a request with an `Authorization: Bearer <token>` header, follow these steps:

### A. Extract and Parse
1. Extract the token from the header.
2. Decode the JWT header to find the `kid` (Key ID) and `alg` (Algorithm).

### B. Verify Signature (RS256)
1. Match the `kid` against your cached JWKS.
2. Verify the RS256 signature using the corresponding public RSA key.

### C. Validate Standard Claims
- **Expiration (`exp`)**: Ensure current time < `exp`.
- **Issuer (`iss`)**: If configured, ensure `iss` matches `https://auth.yourdomain.com`.
- **Audience (`aud`)**: If configured, ensure your service is in the `aud` list.

## 3. Interpreting Claims

Once verified, you can trust the following claims:

| Claim | Description | Usage |
| :--- | :--- | :--- |
| `sub` | Subject | The unique User ID in the DeCentralAuth system. Use this as the primary key for your local user preferences or data. |
| `sid` | Session ID | The unique ID for the user's current session. |

## 4. Real-time Revocation (Optional)

By default, verification is decentralized and stateless. If your service requires immediate revocation (e.g., for high-value transactions), you must perform a "sync check":

1. Verify the JWT locally (as described above).
2. Call the DeCentralAuth introspection or session check endpoint with the `sid` if the token is still within its validity window but the user might have logged out.

> [!TIP]
> **Performance Advice**: Most services should rely on the short lifetime (15m) of the Access Token instead of a real-time sync check to maintain high performance and availability.

## 5. Security Best Practices

- **Never Log JWTs**: Treat access tokens as sensitive credentials. Do not log them in plaintext.
- **Use HTTPS Only**: All traffic between the client, your service, and the auth server must be encrypted.
- **Validate `alg`**: Explicitly check that the `alg` is `RS256` and not `none`.
