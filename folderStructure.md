
## Top-level layout

```text
CentralAuth/
├── apps/
│   └── auth-server/
├── packages/
│   ├── core/
│   ├── crypto/
│   ├── tokens/
│   ├── oauth/
│   ├── policies/
│   └── audit/
├── infrastructure/
│   ├── db/
│   ├── migrations/
│   ├── docker/
│   └── terraform/
├── docs/
├── scripts/
├── .env.example
├── docker-compose.yml
└── README.md
```


### apps

Runnable services only.

```text
apps/auth-server/
├── src/
│   ├── http/
│   │   ├── server.ts
│   │   ├── plugins.ts
│   │   └── cookies.ts
│   ├── routes/
│   │   ├── login.routes.ts
│   │   ├── authorize.routes.ts
│   │   └── token.routes.ts
│   ├── controllers/
│   │   ├── login.controller.ts
│   │   ├── authorize.controller.ts
│   │   └── token.controller.ts
│   ├── bootstrap/
│   │   └── container.ts
│   └── index.ts
└── tsconfig.json
```



### packages


Identity domain

```text
core/
 ├── user.entity.ts
 ├── session.entity.ts
 ├── client.entity.ts
 ├── device.entity.ts
 ├── repositories/
 └── services/
```
 
#### packages/crypto

Security primitives

```text
crypto/
 ├── password.ts        // hash, verify
 ├── keys.ts            // RSA / EC keys
 ├── signatures.ts
 └── random.ts
```


#### packages/tokens

JWT & token lifecycle

```text
tokens/
 ├── access-token.ts
 ├── refresh-token.ts
 ├── id-token.ts
 ├── jwks.ts
 ├── claims.ts
 └── verifier.ts

```

#### packages/oauth

OAuth2 + OIDC logic

```text
packages/oauth/
 ├── src/
 │   ├── entities/
 │   │   └── authorization-code.ts
 │   ├── repositories/
 │   │   └── authorization-code.repository.ts
 │   ├── services/
 │   │   ├── authorization.service.ts
 │   │   └── token.service.ts
 │   ├── validators/
 │   │   ├── client.validator.ts
 │   │   └── scope.validator.ts
 │   └── index.ts

```
#### packages/policies

Authorization rules

```text
policies/
 ├── role.policy.ts
 ├── scope.policy.ts
 ├── risk.policy.ts
 └── evaluator.ts
```

#### packages/audit

Compliance & traceability

```text
audit/
 ├── events.ts
 ├── logger.ts
 └── sinks/
     ├── db.ts
     └── kafka.ts

```
#### packages/infrastructure

Infrastructure abstractions

```text
infrastructure/
 ├── db/
 │   ├── mongodb.ts
 │   └── redis.ts
 ├── migrations/
 ├── docker/
 └── terraform/


```

#### docs

```text
docs/
 ├── architecture.md
 ├── token-design.md
 ├── threat-model.md
 └── flows/
     ├── login.md
     └── refresh.md
```