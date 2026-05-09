import type { TokenService } from "@application/ports/token.port.js";
import type { AuthTokenPayload } from "@application/types/auth-token-payload.js";
import { env } from "@config/env.config.js";
import jwt from "jsonwebtoken";

export class JwtTokenService implements TokenService {
  generate(payload: AuthTokenPayload): string {
    const expiresIn = env.JWT_EXPIRES_IN as NonNullable<
      jwt.SignOptions["expiresIn"]
    >;

    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn,
    });
  }

  verify(token: string): AuthTokenPayload {
    return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
  };
};