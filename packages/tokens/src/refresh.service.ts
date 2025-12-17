// packages/tokens/src/refresh.service.ts
// import { RefreshTokenService } from "./tokens/refresh-token.js";
import { RefreshTokenRepository } from "../../core/src/repositories/refresh-token.repository.js"
import { TokenSigner } from "./signer";

export class RefreshTokenService {
    constructor(
        private readonly repo: RefreshTokenRepository,
        private readonly signer: TokenSigner
    ) { }

    async rotate(refreshTokenId: string) {
        const token = await this.repo.findById(refreshTokenId);
        if (!token) throw new Error('INVALID_REFRESH_TOKEN');

        await this.repo.revoke(refreshTokenId);

        return this.signer.sign(
            { userId: token.userId },
            900
        );
    }
}
