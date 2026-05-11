import express from "express";
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
