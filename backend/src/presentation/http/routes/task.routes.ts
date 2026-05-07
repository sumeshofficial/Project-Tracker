import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { authenticate } from "../middleware/auth.middleware.js";
import type { TokenService } from "@application/ports/token.port.js";
import type { UpdateTaskUseCase } from "@application/use-cases/task/update-task.usecase.js";
import type { DeleteTaskUseCase } from "@application/use-cases/task/delete-task.usecase.js";
import type { GetTaskUseCase } from "@application/use-cases/task/get-task.usecase.js";
import { GetTaskDtoSchema } from "@application/dtos/task/get-task.dto.js";
import { UpdateTaskDtoSchema } from "@application/dtos/task/update-task.dto.js";

export const createTaskRouter = (
  updateTaskUseCase: UpdateTaskUseCase,
  deleteTaskUseCase: DeleteTaskUseCase,
  getTaskUseCase: GetTaskUseCase,
  tokenService: TokenService
) => {
  const router = Router();

  router.get(
    "/:id",
    authenticate(tokenService),
    asyncHandler(async (req, res) => {
      const params = GetTaskDtoSchema.parse(req.params);
      const task = await getTaskUseCase.execute(req.user!.sub, params.id);
      res.status(200).json({ success: true, data: task });
    })
  );

  router.patch(
    "/:id",
    authenticate(tokenService),
    asyncHandler(async (req, res) => {
      const params = GetTaskDtoSchema.parse(req.params);
      const dto = UpdateTaskDtoSchema.parse(req.body);
      const task = await updateTaskUseCase.execute(
        req.user!.sub,
        params.id,
        dto
      );
      res.status(200).json({ success: true, data: task });
    })
  );

  router.delete(
    "/:id",
    authenticate(tokenService),
    asyncHandler(async (req, res) => {
      const params = GetTaskDtoSchema.parse(req.params);
      await deleteTaskUseCase.execute(req.user!.sub, params.id);
      res.status(204).send();
    })
  );

  return router;
};
