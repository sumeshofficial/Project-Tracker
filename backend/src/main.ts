import { LoginUseCase } from '@application/use-cases/auth/login.usecase.js';
import { RegisterUseCase } from '@application/use-cases/auth/register.usecase.js';
import { env } from '@config/env.config.js';
import { PasswordHashService } from '@infrastructure/auth/bcrypt-password.service.js';
import { JwtTokenService } from '@infrastructure/auth/jwt-token.service.js';
import { PrismaUserRepository } from '@infrastructure/repositories/prisma-user.repository.js';
import { errorHandlerMiddleware } from '@presentation/http/middleware/error-handle.middleware.js';
import { createAuthRouter } from '@presentation/http/routes/auth.routes.js';
import express from 'express';

const app = express();

app.use(express.json());

/**
 * Infrastructure
 */
const userRepository = new PrismaUserRepository();
const passwordHasher = new PasswordHashService();
const tokenService = new JwtTokenService();

/**
 * Use cases
 */
const registerUseCase = new RegisterUseCase(
    userRepository,
    passwordHasher
)

const loginUseCase = new LoginUseCase(
    userRepository,
    passwordHasher,
    tokenService
)

/**
 * Router
 */
const authRouter = createAuthRouter(
    registerUseCase,
    loginUseCase,
    tokenService,
);

// console.log("AUTH ROUTER:", authRouter);

app.use("/api/auth", authRouter);

app.use(errorHandlerMiddleware());

app.listen(env.PORT, () => {
    console.log(`Server listening on port ${env.PORT}`);
})