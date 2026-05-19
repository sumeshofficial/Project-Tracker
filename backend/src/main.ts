import express from "express";
import { pinoHttp } from "pino-http";
import { env } from "@config/env.config";

import { LoginUseCase } from "@application/use-cases/auth/login.usecase";
import { RegisterUseCase } from "@application/use-cases/auth/register.usecase";
import { CreateProjectUseCase } from "@application/use-cases/project/create-project.usecase";
import { ListProjectsUseCase } from "@application/use-cases/project/list-projects.usecase";
import { UpdateProjectUseCase } from "@application/use-cases/project/update-project.usecase";
import { GetProjectUseCase } from "@application/use-cases/project/get-project.usecase";
import { DeleteProjectUseCase } from "@application/use-cases/project/delete-project.usecase";
import { ListTasksUseCase } from "@application/use-cases/task/list-tasks.usecase";
import { CreateTaskUseCase } from "@application/use-cases/task/create-task.usecase";
import { UpdateTaskUseCase } from "@application/use-cases/task/update-task.usecase";
import { GetTaskUseCase } from "@application/use-cases/task/get-task.usecase";
import { DeleteTaskUseCase } from "@application/use-cases/task/delete-task.usecase";

import { PasswordHashService } from "@infrastructure/auth/bcrypt-password.service";
import { JwtTokenService } from "@infrastructure/auth/jwt-token.service";
import { PrismaUserRepository } from "@infrastructure/repositories/prisma-user.repository";
import { PrismaProjectRepository } from "@infrastructure/repositories/prisma-project.repository";
import { PrismaTaskRepository } from "@infrastructure/repositories/prisma-task.repository";

import { errorHandlerMiddleware } from "@presentation/http/middleware/error-handle.middleware";
import { createAuthRouter } from "@presentation/http/routes/auth.routes";
import { createProjectRouter } from "@presentation/http/routes/project.routes";
import { createTaskRouter } from "@presentation/http/routes/task.routes";
import { AuthController } from "@presentation/http/controller/auth.controller";
import { ProjectController } from "@presentation/http/controller/project.controller";
import { TaskController } from "@presentation/http/controller/task.controller";

import { pinoLogger } from "@infrastructure/logger/pino.logger";

const app = express();

const httpLogger = pinoHttp({
  logger: pinoLogger
})

app.use(express.json());
app.use(httpLogger);

/**
 * Infrastructure
 */
const userRepository = new PrismaUserRepository();
const passwordHasher = new PasswordHashService();
const tokenService = new JwtTokenService();

const projectRepository = new PrismaProjectRepository();
const taskRepository = new PrismaTaskRepository();

/**
 * Use cases
 */
const registerUseCase = new RegisterUseCase(userRepository, passwordHasher, pinoLogger);
const loginUseCase = new LoginUseCase(
  userRepository,
  passwordHasher,
  tokenService,
  pinoLogger
);

const createProjectUseCase = new CreateProjectUseCase(projectRepository, pinoLogger);
const listProjectsUseCase = new ListProjectsUseCase(projectRepository, pinoLogger);
const updateProjectUseCase = new UpdateProjectUseCase(projectRepository, pinoLogger);
const getProjectUseCase = new GetProjectUseCase(projectRepository, pinoLogger);
const deleteProjectUseCase = new DeleteProjectUseCase(projectRepository, pinoLogger);

const listTasksUseCase = new ListTasksUseCase(taskRepository, pinoLogger);
const createTaskUseCase = new CreateTaskUseCase(taskRepository, pinoLogger);
const updateTaskUseCase = new UpdateTaskUseCase(taskRepository, pinoLogger);
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository, pinoLogger);
const getTaskUseCase = new GetTaskUseCase(taskRepository, pinoLogger);

/**
 * Controller
 */
const authController = new AuthController(registerUseCase, loginUseCase);

const projectController = new ProjectController(
  createProjectUseCase,
  listProjectsUseCase,
  updateProjectUseCase,
  deleteProjectUseCase,
  getProjectUseCase
);

const taskController = new TaskController(
  createTaskUseCase,
  listTasksUseCase,
  updateTaskUseCase,
  deleteTaskUseCase,
  getTaskUseCase
);

/**
 * Router
 */
const authRouter = createAuthRouter(authController, tokenService);
const projectRouter = createProjectRouter(
  projectController,
  taskController,
  tokenService
);
const taskRouter = createTaskRouter(taskController, tokenService);

app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);
app.use("/api/tasks", taskRouter);

app.use(errorHandlerMiddleware());

app.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});
