import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { CreateProjectUseCase } from "@application/use-cases/project/create-project.usecase.js";
import type { ListProjectsUseCase } from "@application/use-cases/project/list-projects.usecase.js";
import type { UpdateProjectUseCase } from "@application/use-cases/project/update-project.usecase.js";
import type { DeleteProjectUseCase } from "@application/use-cases/project/delete-project.usecase.js";
import type { GetProjectUseCase } from "@application/use-cases/project/get-project.usecase.js";
import type { TokenService } from "@application/ports/token.port.js";
import { CreateProjectDtoSchema } from "@application/dtos/project/create-project.dto.js";
import { GetProjectDtoSchema } from "@application/dtos/project/get-project.dto.js";
import { UpdateProjectDtoSchema } from "@application/dtos/project/update-project.dto.js";
import { DeleteProjectDtoSchema } from "@application/dtos/project/delete-project.dto.js";

export const createProjectRouter = (
  createProjectUseCase: CreateProjectUseCase,
  listProjectsUseCase: ListProjectsUseCase,
  updateProjectUseCase: UpdateProjectUseCase,
  deleteProjectUseCase: DeleteProjectUseCase,
  getProjectUseCase: GetProjectUseCase,
  tokenService: TokenService
) => {
  const router = Router();

  router.post(
    "/",
    authenticate(tokenService),
    asyncHandler(async (req, res) => {
      const dto = CreateProjectDtoSchema.parse(req.body);
      const project = await createProjectUseCase.execute(dto, req.user!.sub);
      res.status(201).json({ success: true, data: project });
    })
  );

  router.get(
    "/",
    authenticate(tokenService),
    asyncHandler(async (req, res) => {
      const projects = await listProjectsUseCase.execute(req.user!.sub);
      res.status(200).json({ success: true, data: projects });
    })
  );

  router.get(
    "/:id",
    authenticate(tokenService),
    asyncHandler(async (req, res) => {
      const dto = GetProjectDtoSchema.parse(req.params);
      const project = await getProjectUseCase.execute(req.user!.sub, dto);
      res.status(200).json({ success: true, data: project });
    })
  );

  router.patch(
    "/:id",
    authenticate(tokenService),
    asyncHandler(async (req, res) => {
      const params = GetProjectDtoSchema.parse(req.params);
      const dto = UpdateProjectDtoSchema.parse(req.body);
      const project = await updateProjectUseCase.execute(req.user!.sub, params.id, dto);
      res.status(200).json({ success: true, data: project });
    })
  );

  router.delete(
    "/:id",
    authenticate(tokenService),
    asyncHandler(async (req, res) => {
      const dto = DeleteProjectDtoSchema.parse(req.params);
      await deleteProjectUseCase.execute(req.user!.sub, dto);
      res.status(204).send();
    })
  );

  return router;
};
