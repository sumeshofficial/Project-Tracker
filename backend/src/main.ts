import express from "express";
import { env } from "@config/env.config.js";
import { LoginUseCase } from "@application/use-cases/auth/login.usecase.js";
import { RegisterUseCase } from "@application/use-cases/auth/register.usecase.js";
import { PasswordHashService } from "@infrastructure/auth/bcrypt-password.service.js";
import { JwtTokenService } from "@infrastructure/auth/jwt-token.service.js";
import { PrismaUserRepository } from "@infrastructure/repositories/prisma-user.repository.js";
import { errorHandlerMiddleware } from "@presentation/http/middleware/error-handle.middleware.js";
import { createAuthRouter } from "@presentation/http/routes/auth.routes.js";
import { createProjectRouter } from "@presentation/http/routes/project.routes.js";
import { CreateProjectUseCase } from "@application/use-cases/project/create-project.usecase.js";
import { PrismaProjectRepository } from "@infrastructure/repositories/prisma-project.repository.js";
import { ListProjectsUseCase } from "@application/use-cases/project/list-projects.usecase.js";
import { UpdateProjectUseCase } from "@application/use-cases/project/update-project.usecase.js";
import { GetProjectUseCase } from "@application/use-cases/project/get-project.usecase.js";
import { DeleteProjectUseCase } from "@application/use-cases/project/delete-project.usecase.js";

const app = express();

app.use(express.json());

/**
 * Infrastructure
 */
const userRepository = new PrismaUserRepository();
const passwordHasher = new PasswordHashService();
const tokenService = new JwtTokenService();

const projectRepository = new PrismaProjectRepository();

/**
 * Use cases
 */
const registerUseCase = new RegisterUseCase(userRepository, passwordHasher);
const loginUseCase = new LoginUseCase(
  userRepository,
  passwordHasher,
  tokenService
);

const createProjectUseCase = new CreateProjectUseCase(projectRepository);
const listProjectsUseCase = new ListProjectsUseCase(projectRepository);
const updateProjectUseCase = new UpdateProjectUseCase(projectRepository);
const getProjectUseCase = new GetProjectUseCase(projectRepository);
const deleteProjectUseCase = new DeleteProjectUseCase(projectRepository);

/**
 * Router
 */
const authRouter = createAuthRouter(
  registerUseCase,
  loginUseCase,
  tokenService
);

const projectRouter = createProjectRouter(
  createProjectUseCase,
  listProjectsUseCase,
  updateProjectUseCase,
  deleteProjectUseCase,
  getProjectUseCase,
  tokenService
);

app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);

app.use(errorHandlerMiddleware());

app.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});
