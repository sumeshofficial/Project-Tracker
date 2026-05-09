import type { TokenService } from "@application/ports/token.port.js";
import { LoginUseCase } from "@application/use-cases/auth/login.usecase.js";
import type { RegisterUseCase } from "@application/use-cases/auth/register.usecase.js";
import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { RegisterDtoSchema } from "@application/dtos/auth/register.dto.js";
import { LoginDtoSchema } from "@application/dtos/auth/login.dto.js";
import { authenticate } from "../middleware/auth.middleware.js";

export const createAuthRouter = (
  registerUseCase: RegisterUseCase,
  loginUseCase: LoginUseCase,
  tokenService: TokenService
) => {
  const router = Router();

  router.post(
    "/register",
    asyncHandler(async (req, res) => {
      const dto = RegisterDtoSchema.parse(req.body);
      const user = await registerUseCase.execute(dto);
      res.status(201).json({ success: true, data: user });
    })
  );

  router.post(
    "/login",
    asyncHandler(async (req, res) => {
      const dto = LoginDtoSchema.parse(req.body);
      const token = await loginUseCase.execute(dto);
      res.status(200).json({ success: true, data: token });
    })
  );

  router.get(
    "/me",
    authenticate(tokenService),
    asyncHandler(async (req, res) => {
      const user = req.user;
      res.status(200).json({
        success: true,
        data: {
          id: user?.sub,
          email: user?.email,
        },
      });
    })
  );

  return router;
};
