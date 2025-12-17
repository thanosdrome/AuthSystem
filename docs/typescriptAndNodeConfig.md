## TypeScript and Node.js Configuration

### tsconfig.json

```json
{
    "extends": "./configs/tsconfig.base.json",
    "compilerOptions": {
        "baseUrl": "./",
        "outDir": "dist"
    }
}
```


### ts.node.json

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "ES2022", // Use ES2022 for Node.js usually give IDE error for promises, path errors are link to this sometimes.
        "moduleResolution": "node",
        "lib": [
            "ES2022"
        ],
        "outDir": "dist",
        "rootDir": "src",
        "sourceMap": true,
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true
    }
}
```

### tsconfig.base.json

```json
{
    "compilerOptions": {
        "baseUrl": "./",
        "outDir": "dist"
    }
}
```


### tsconfig.json

Creating central path resolution for all packages

```text 
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/audit": [
                "packages/audit/src"
            ],
            "@/core": [
                "packages/core/src"
            ],
            "@/crypto": [
                "packages/crypto/src"
            ],
            "@/oauth": [
                "packages/oauth/src"
            ],
            "@/policies": [
                "packages/policies/src"
            ],
            "@/tokens": [
                "packages/tokens/src"
            ],
            "@/infrastructure": [
                "infrastructure"
            ]
        }
    }
}
```

this gives a seperate location to add additional paths for each package


Now have to add this root ts config to extend the base config

```text
"extends": "./configs/tsconfig.base.json",
```