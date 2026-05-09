import type { AuthTokenPayload } from "@application/types/auth-token-payload.js";

export interface TokenService {
    generate(payload: AuthTokenPayload): string;
    verify(token: string): AuthTokenPayload;
}