import type { AuthTokenPayload } from "@application/types/auth-token-payload.ts";

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export {};