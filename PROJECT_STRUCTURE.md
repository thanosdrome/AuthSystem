# CentralAuth Project Structure

This document provides a comprehensive overview of the CentralAuth monorepo structure, detailing the roles and responsibilities of each directory and package.

## Top-Level Directory Overview

```text
DeCentralAuth/
├── apps/               # Runnable service applications
├── packages/           # Core logic and shared libraries
├── infrastructure/     # Technology-specific implementations & DevOps
├── configs/            # Global configuration files
├── docs/               # System documentation
├── scripts/            # Utility scripts for development/deployment
├── .env.example        # Template for environment variables
├── package.json        # Workspace configuration
└── tsconfig.json       # Root TypeScript configuration
```

---

## 🚀 Apps

### `apps/authSystem`
The primary application entry point. A Fastify-based server that orchestrates authentication and authorization flows.

- **`src/bootstrap/`**: Application initialization and Dependency Injection (DI) container setup.
- **`src/http/`**: HTTP server configuration, plugins, and cookie handling.
- **`src/routes/`**: API endpoint definitions (e.g., `login.routes.ts`, `oauth.routes.ts`).
- **`src/controllers/`**: Orchestration logic that calls services from `packages/`.
- **`src/middlewares/`**: Custom Fastify middlewares (e.g., for auth checks).
- **`src/index.ts`**: Entry point for starting the server.

---

## 📦 Packages

### `packages/core`
The "domain" layer. Contains business entities, repository interfaces, and shared service logic.
- **`entities/`**: Domain objects (User, Session, Client, Device).
- **`repositories/`**: Interfaces for data access (implementation resides in `infrastructure`).
- **`services/`**: Core business logic (User management, Registration).
- **`enums/`**: Shared constants and status codes.

### `packages/tokens`
Logic for generating and verifying tokens (JWT, Refresh Tokens).
- **`tokens/`**: Implementations for Access, Refresh, and ID tokens.
- **`claims/`**: Payload structures for different token types.
- **`jwks/`**: Key set management for public verification.
- **`signer.ts`**: High-level signing interface.
- **`verifier.ts`**: Token validation logic.

### `packages/crypto`
Security primitives and cryptographic wrappers.
- **`password.ts`**: Argon2-based password hashing.
- **`keys.ts`**: RSA/EC key loading and management.
- **`signatures.ts`**: Logic for creating and verifying digital signatures.
- **`random.ts`**: Secure random string/ID generation.

### `packages/oauth`
OAuth 2.0 and OpenID Connect (OIDC) protocol logic.
- **`src/entities/`**: OAuth-specific entities (Authorization Codes).
- **`src/services/`**: Implementation of OAuth flows (Authorize, Token exchange).
- **`src/validators/`**: Input validation for clients and scopes.

### `packages/policies`
Authorization and rule evaluation.
- **`role.policy.ts`**: RBAC logic.
- **`scope.policy.ts`**: Scope-based access control.
- **`evaluator.ts`**: Central logic for policy decision making.

### `packages/audit`
Tracking and logging of security-sensitive events.
- **`events.ts`**: Definition of auditable events.
- **`logger.ts`**: High-level auditing interface.
- **`sinks/`**: Destinations for audit logs (DB, File, etc.).

---

## 🛠️ Infrastructure

### `infrastructure/db`
Persistence layer for PostgreSQL.
- **`postgres/`**: Database client and connection pooling.
- **`migrations/`**: SQL migration files.
- **`schema.sql`**: Full database schema definition.

### `infrastructure/cache`
Ephemeral storage using Redis.
- **`redis/`**: Client setup and common operations (Get/Set/TTL).
- **Used for**: OAuth state, PKCE verifiers, and rate limiting.

### `infrastructure/keys`
Storage for cryptographic keys (Private/Public RSA keys).

### `infrastructure/docker`
Dockerfiles and container orchestration configurations.

---

## 📖 Documentation & Scripts

- **`docs/`**: Architecture diagrams, request flows, and integration guides.
- **`configs/`**: Shared configuration for ESLint, TypeScript, and other development tools across the monorepo.
- **`scripts/`**: CI/CD scripts, database seeding, and development helpers.
