import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import type { TokenService } from "@application/ports/token.port";
import { TaskController } from "../controller/task.controller";

export const createTaskRouter = (
  taskController: TaskController,
  tokenService: TokenService
) => {
  const router = Router();

  router.get("/:id", authenticate(tokenService), taskController.get);

  router.patch("/:id", authenticate(tokenService), taskController.update);

  router.delete("/:id", authenticate(tokenService), taskController.delete);

  return router;
};
