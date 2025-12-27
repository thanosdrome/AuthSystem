# CentralAuth Architecture Documentation

## System Overview

CentralAuth is a production-grade centralized authentication and authorization server designed with a "centralized issuance, decentralized verification" philosophy. It provides a robust, secure, and scalable way to manage user identities and sessions while allowing microservices and external clients to verify user claims without constant round-trips to the auth server.

The system is built using Node.js and TypeScript, leveraging a modern stack including Fastify, PostgreSQL, and Redis. It supports industry-standard protocols like OAuth 2.0 and OpenID Connect (OIDC) patterns, ensuring compatibility and security.

## Core Architectural Principles

### Centralized Issuance vs. Decentralized Verification
The primary goal is to minimize the load on the auth server. The auth server remains the source of truth for user data and session life cycles, but authentication is performed via signed JSON Web Tokens (JWTs). Any service with access to the public keys (exposed via JWKS) can verify the token's authenticity, integrity, and claims independently.

### Layered Architecture
The codebase follows a strictly layered approach to separate concerns and ensure testability:
- **Routes Layer**: Handles HTTP concerns, request validation, and response formatting.
- **Controller Layer**: Orchestrates business logic by interacting with multiple services.
- **Service Layer**: Contains core business rules (e.g., password validation, token signing).
- **Repository/Infrastructure Layer**: Abstraction over data storage (PostgreSQL and Redis).

### Security by Design
Security is not an afterthought. The system enforces:
- **Least Privilege**: Only necessary claims are included in tokens.
- **Cryptographic Rigor**: RSA-256 for signing, Argon2 for hashing, and SHA-256 for PKCE.
- **Ephemeral States**: Security-sensitive temporary data (like OAuth bridge states) are stored in Redis with strict TTLs.

## Directory Structure

### `apps/authSystem`
The primary application entry point. It contains the Fastify server, route definitions, and the dependency injection container.
- `src/routes/`: API endpoint definitions organized by feature.
- `src/controllers/`: Logic for handling requests and coordinating services.
- `src/bootstrap/`: Initialization logic for the application and its dependencies.

### `packages/core`
Contains shared domain logic, entities, and repository interfaces. This package defines the "what" of the system without being tied to specific technologies.

### `packages/crypto`
The cryptographic backbone of the system.
- Responsibility: Password hashing (Argon2), PKCE challenge generation, RSA key loading/generation, and random ID generation.
- Design: Wraps standard libraries to provide a consistent, high-level API for the rest of the system.

### `infrastructure/`
Contains technology-specific implementations.
- `db/`: PostgreSQL schema migrations and repository implementations (e.g., using `pg` or an ORM).
- `cache/`: Redis repository implementations for ephemeral data.
- `keys/`: Persistent storage for the system's RSA signing keys.

## Authentication Flows

### Password Login
1. Client submits email and password.
2. System fetches user from PostgreSQL.
3. Password is verified using Argon2.
4. A session is created in PostgreSQL; a refresh token is issued and stored.
5. A JWT access token is signed using the private RSA key and returned to the client.

### OAuth Login (Google)
1. **Initiation**: Client requests `/oauth/google`. The server generates a `state` and a PKCE `code_verifier`, stores them in Redis, and redirects the user to Google.
2. **Callback**: User returns with an authorization `code`. The server validates the `state`, retrieves the `code_verifier`, and exchanges the `code` for a Google access token.
3. **Resolution**: The server fetches user info from Google, resolves/links it to a local user record in PostgreSQL, and issues local session/tokens.

### Refresh Token Rotation
To enhance security, refresh tokens are single-use.
1. Client submits a valid refresh token.
2. Server verifies the token exists and is not revoked.
3. Server revokes the old token and issues a new refresh token and a new access token.
4. If a revoked token is reused, the entire session is flagged as compromised.

### Logout and Session Revocation
Logout cascades through the system:
1. The specific refresh token is revoked.
2. The underlying session in PostgreSQL is marked as inactive.
3. Future refresh attempts using any token related to that session will fail.

## Security Mechanisms

### JWT Design
- **Signing**: Tokens are signed using RS256 (RSA Signature with SHA-256).
- **Claims**:
    - `sub`: User ID.
    - `sid`: Session ID (allows for precise revocation).
    - `iat`: Issued at time.
    - `exp`: Expiration time (short-lived, e.g., 15 minutes).

### JWKS and Key Management
The server exposes a JSON Web Key Set (JWKS) endpoint.
- **Persistence**: RSA keys are generated on the first boot and persisted to `infrastructure/keys`.
- **Public Access**: Other services fetch the public keys from the JWKS endpoint to verify JWTs without needing a direct connection to the auth database.

### OAuth State (CSRF Protection)
The `state` parameter is used as a non-predictable nonce. It is stored in Redis with a 5-minute TTL and verified upon callback to prevent Cross-Site Request Forgery.

### PKCE (Proof Key for Code Exchange)
PKCE is used to prevent authorization code injection.
1. Server generates a random `code_verifier` and its hash `code_challenge`.
2. The `code_challenge` is sent to Google.
3. Google returns the `code` only if the server later provides the matching `code_verifier`.

### Rate Limiting Strategy
Rate limiting is applied at the infrastructure layer (e.g., using Fastify-Rate-Limit or a reverse proxy).
- **Global**: Protects against general DoS.
- **Endpoint Specific**: Stricter limits on `/login`, `/register`, and `/password-reset` to prevent brute-force attacks.

## Data Ownership

### PostgreSQL (Source of Truth)
- **Users**: Persistent identity data, password hashes, and profiles.
- **Sessions**: Long-term record of active logins and device information.
- **Refresh Tokens**: History of issued tokens for rotation and audit trails.

### Redis (Ephemeral Data)
- **OAuth States**: Temporary bridge data between login initiation and callback.
- **Rate Limit Buckets**: Fast, atomic counters for request throttling.
- **Cache**: Future use for highly accessed public data.

## Failure Modes and Resilience

- **Auth Server Downtime**: Already-issued access tokens remain valid until expiration. Services can continue to function as long as they have cached the public keys from the JWKS endpoint.
- **Key Rotation**: The system is designed to support multiple keys in the JWKS. New keys can be introduced while old keys remain valid for verification during the transition.
- **Token Expiration**: Short access token lifetimes ensure that even if a token is stolen, the window of misuse is small. Refresh tokens allow for seamless UX without re-authentication.

## Scope Boundaries

### Within Scope
- Centralized user identity management.
- Multi-factor authentication readiness (session-based).
- Standardized token issuance and revocation.

### Out of Scope
- Detailed User Profile management (should be handled by a separate Profile Service).
- Authorization logic/RBAC for specific downstream resources (downstream services should interpret the `sub` and locally defined roles).

## Detailed Request Flows

For a deep dive into the technical implementation of specific requests, refer to the [Request Flow Documentation](file:///d:/Projects/DeCentralAuth/docs/request_flow.md).

## External Integration

Developers building services that consume DeCentralAuth tokens should refer to the [Developer Integration Guide](file:///d:/Projects/DeCentralAuth/docs/integration_guide.md) for details on JWKS and JWT verification.

## Future Extensions

- **MFA Support**: Integration of TOTP or WebAuthn without changing the core session structure.
- **Tenant Isolation**: Adding a `tenant_id` to the user and token claims for multi-tenant support.
- **Key Rotation Automation**: A background worker to periodically generate new RSA keys and update the JWKS.
