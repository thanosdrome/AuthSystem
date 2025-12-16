# Threat Model — Central Auth System

## Assets
- User credentials
- Sessions
- Tokens
- Authorization codes

## Trust Boundaries
- Browser ↔ Auth Server
- Auth Server ↔ Resource Servers
- Public vs Confidential Clients

## Threats & Mitigations

### Credential Stuffing
- Password hashing (Argon2)
- Short error messages
- Rate limiting (infra-level)

### Authorization Code Interception
- PKCE enforced
- Short-lived codes
- Single-use codes

### Token Replay
- Short-lived access tokens
- Refresh token rotation
- Session revocation

### Insider Abuse
- Audit logs
- Minimal token claims
