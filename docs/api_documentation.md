# DeCentralAuth API Documentation

This document provides a comprehensive overview of the available API endpoints in the `DeCentralAuth` system.

## Authentication & Registration

### [POST] `/register`
Registers a new user with email and password.
- **Body**:
  - `email` (string, required): User's email address.
  - `password` (string, required): User's password.
- **Response**: `201 Created` on success.
- **Errors**: `400 INVALID_INPUT`, `429 TOO_MANY_REQUESTS`.

### [POST] `/login`
Authenticates a user and returns session/token information.
- **Body**:
  - `email` (string, required): User's email address.
  - `password` (string, required): User's password.
- **Response**: `200 OK` with session and token details.
- **Errors**: `400 INVALID_INPUT`, `401 INVALID_CREDENTIALS`, `429 TOO_MANY_REQUESTS`.

### [GET] `/verify-email`
Verifies a user's email address using a token sent via email.
- **Query Parameters**:
  - `token` (string, required): The verification token.
- **Response**: `200 OK` with `success: true`.
- **Errors**: `400 MISSING_TOKEN`.

---

## OAuth 2.0 & OpenID Connect

### [GET] `/authorize`
Initiates the OAuth2 authorization flow.
- **Query Parameters**:
  - `client_id` (string, required)
  - `redirect_uri` (string, required)
  - `scope` (string, required): Space-separated scopes.
- **Behavior**: Redirects to `/login` if no session exists, otherwise redirects back with an authorization code.

### [POST] `/token`
Exchanges an authorization code for access and refresh tokens.
- **Body**:
  - `code` (string, required)
  - `client_id` (string, required)
  - `code_verifier` (string, required)
- **Response**: `200 OK` with tokens.

### [POST] `/token/refresh`
Issues a new access token using a valid refresh token.
- **Body**:
  - `refreshToken` (string, required)
- **Response**: `200 OK` with new tokens.
- **Errors**: `429 TOO_MANY_REQUESTS`.

### [GET] `/jwks`
Returns the JSON Web Key Set (JWKS) for verifying JWT signatures.
- **Response**: `200 OK` with the JWKS object.

---

## External OAuth (Google)

### [GET] `/oauth/google`
Redirects the user to Google's OAuth 2.0 consent page.
- **Behavior**: Redirects to Google.

### [GET] `/oauth/google/callback`
The callback endpoint for Google OAuth.
- **Query Parameters**:
  - `code` (string, required): Authorization code from Google.
- **Behavior**: Exchanges code for Google tokens, resolves local user, and redirects to frontend with local tokens.

---

## Password Management

### [POST] `/password/reset/request`
Requests a password reset email.
- **Body**:
  - `email` (string, required)
- **Response**: `200 OK` with `status: ok` (always returns success to prevent user enumeration).

### [POST] `/password/reset/confirm`
Confirms password reset using a token.
- **Body**:
  - `token` (string, required)
  - `password` (string, required): New password (min 8 chars).
- **Response**: `200 OK` with `status: ok`.
- **Errors**: `400 INVALID_INPUT`, `400 INVALID_RESET_TOKEN`.

---

## System

### [GET] `/health`
Check the health status of the authentication service.
- **Response**: `200 OK` status.
