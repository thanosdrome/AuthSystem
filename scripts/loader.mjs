import { createEsmHooks } from 'ts-node';
import tsconfigPaths from 'tsconfig-paths';

const { resolve, load } = createEsmHooks({
    transpileOnly: true
});

const baseUrl = process.cwd();

const matchPath = tsconfigPaths.createMatchPath(
    baseUrl,
    {
        "@/*": ["packages/*/src"],
        "@/core": ["packages/core/src"],
        "@/crypto": ["packages/crypto/src"],
        "@/tokens": ["packages/tokens/src"],
        "@/oauth": ["packages/oauth/src"],
        "@/policies": ["packages/policies/src"],
        "@/audit": ["packages/audit/src"]
    }
);

export async function resolveHook(specifier, context, defaultResolve) {
    const mapped = matchPath(specifier);
    if (mapped) {
        return defaultResolve(mapped, context);
    }
    return resolve(specifier, context, defaultResolve);
}

export { load };
