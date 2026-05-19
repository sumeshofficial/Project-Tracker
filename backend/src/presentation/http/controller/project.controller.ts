import type { Request, Response } from "express";
import { CreateProjectUseCase } from "@application/use-cases/project/create-project.usecase";
import { DeleteProjectUseCase } from "@application/use-cases/project/delete-project.usecase";
import { GetProjectUseCase } from "@application/use-cases/project/get-project.usecase";
import { ListProjectsUseCase } from "@application/use-cases/project/list-projects.usecase";
import { UpdateProjectUseCase } from "@application/use-cases/project/update-project.usecase";
import { CreateProjectDtoSchema } from "@application/dtos/project/create-project.dto";
import { GetProjectDtoSchema } from "@application/dtos/project/get-project.dto";
import { UpdateProjectDtoSchema } from "@application/dtos/project/update-project.dto";
import { DeleteProjectDtoSchema } from "@application/dtos/project/delete-project.dto";
import { HttpStatusCode } from "@shared/constants/http-status";
import { ResponseHelper } from "../helper/response.helper";
import { PROJECT_CONSTANTS } from "@presentation/constants/auth/project.constants";

export class ProjectController {
  constructor(
    private _createProjectUseCase: CreateProjectUseCase,
    private _listProjectsUseCase: ListProjectsUseCase,
    private _updateProjectUseCase: UpdateProjectUseCase,
    private _deleteProjectUseCase: DeleteProjectUseCase,
    private _getProjectUseCase: GetProjectUseCase
  ) {}

  create = async (req: Request, res: Response) => {
    const dto = CreateProjectDtoSchema.parse(req.body);
    const project = await this._createProjectUseCase.execute(
      dto,
      req.user!.sub
    );
    ResponseHelper.success(
      res,
      project,
      PROJECT_CONSTANTS.MESSAGES.PROJECT_CREATED_SUCCESSFULLY,
      PROJECT_CONSTANTS.CODES.OK
    );
  };

  list = async (req: Request, res: Response) => {
    const projects = await this._listProjectsUseCase.execute(req.user!.sub);
    ResponseHelper.success(
      res,
      projects,
      PROJECT_CONSTANTS.MESSAGES.PROJECTS_FETCHED_SUCCESSFULLY,
      PROJECT_CONSTANTS.CODES.OK
    );
  };

  get = async (req: Request, res: Response) => {
    const dto = GetProjectDtoSchema.parse(req.params);
    const project = await this._getProjectUseCase.execute(req.user!.sub, dto);
    ResponseHelper.success(
      res,
      project,
      PROJECT_CONSTANTS.MESSAGES.PROJECT_FETCHED_SUCCESSFULLY,
      PROJECT_CONSTANTS.CODES.OK
    );
  };

  update = async (req: Request, res: Response) => {
    const params = GetProjectDtoSchema.parse(req.params);
    const dto = UpdateProjectDtoSchema.parse(req.body);
    const project = await this._updateProjectUseCase.execute(
      req.user!.sub,
      params.id,
      dto
    );
    ResponseHelper.success(
      res,
      project,
      PROJECT_CONSTANTS.MESSAGES.PROJECT_UPDATED_SUCCESSFULLY,
      PROJECT_CONSTANTS.CODES.OK
    );
  };

  delete = async (req: Request, res: Response) => {
    const dto = DeleteProjectDtoSchema.parse(req.params);
    await this._deleteProjectUseCase.execute(req.user!.sub, dto);
    res.status(PROJECT_CONSTANTS.CODES.NO_CONTENT).send();
  };
}
