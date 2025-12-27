CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  email_verified BOOLEAN NOT NULL,
  password_hash TEXT NOT NULL,
  status TEXT NOT NULL,
  mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  mfa_secret TEXT,
  backup_codes TEXT[],
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE authorization_codes (
  code TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  redirect_uri TEXT NOT NULL,
  scopes TEXT[],
  expires_at TIMESTAMP NOT NULL,
  consumed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE cryptographic_keys (
  kid TEXT PRIMARY KEY,
  private_key_enc TEXT NOT NULL,
  public_key_pem TEXT NOT NULL,
  status TEXT NOT NULL, -- 'PENDING', 'ACTIVE', 'RETIRED'
  created_at TIMESTAMP NOT NULL,
  activated_at TIMESTAMP,
  retired_at TIMESTAMP
);
