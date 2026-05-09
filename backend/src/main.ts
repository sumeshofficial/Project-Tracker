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
import { ListTasksUseCase } from "@application/use-cases/task/list-tasks.usecase.js";
import { PrismaTaskRepository } from "@infrastructure/repositories/prisma-task.repository.js";
import { CreateTaskUseCase } from "@application/use-cases/task/create-task.usecase.js";
import { createTaskRouter } from "@presentation/http/routes/task.routes.js";
import { UpdateTaskUseCase } from "@application/use-cases/task/update-task.usecase.js";
import { GetTaskUseCase } from "@application/use-cases/task/get-task.usecase.js";
import { DeleteTaskUseCase } from "@application/use-cases/task/delete-task.usecase.js";

const app = express();

app.use(express.json());

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

const listTasksUseCase = new ListTasksUseCase(taskRepository);
const createTaskUseCase = new CreateTaskUseCase(taskRepository);
const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
const getTaskUseCase = new GetTaskUseCase(taskRepository);

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
  listTasksUseCase,
  createTaskUseCase,
  tokenService
);

const taskRouter = createTaskRouter(
  updateTaskUseCase,
  deleteTaskUseCase,
  getTaskUseCase,
  tokenService
);

app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);
app.use("/api/tasks", taskRouter);

app.use(errorHandlerMiddleware());

app.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});
