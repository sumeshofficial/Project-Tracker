import type { AuthTokenPayload } from "@application/types/auth-token-payload";

export interface TokenService {
    generate(payload: AuthTokenPayload): string;
    verify(token: string): AuthTokenPayload;
}