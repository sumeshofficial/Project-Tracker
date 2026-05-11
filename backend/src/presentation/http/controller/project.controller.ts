import { CreateProjectUseCase } from "@application/use-cases/project/create-project.usecase";
import { DeleteProjectUseCase } from "@application/use-cases/project/delete-project.usecase";
import { GetProjectUseCase } from "@application/use-cases/project/get-project.usecase";
import { ListProjectsUseCase } from "@application/use-cases/project/list-projects.usecase";
import { UpdateProjectUseCase } from "@application/use-cases/project/update-project.usecase";
import { asyncHandler } from "../utils/async-handler";
import { CreateProjectDtoSchema } from "@application/dtos/project/create-project.dto";
import { GetProjectDtoSchema } from "@application/dtos/project/get-project.dto";
import { UpdateProjectDtoSchema } from "@application/dtos/project/update-project.dto";
import { DeleteProjectDtoSchema } from "@application/dtos/project/delete-project.dto";

export class ProjectController {
  constructor(
    private _createProjectUseCase: CreateProjectUseCase,
    private _listProjectsUseCase: ListProjectsUseCase,
    private _updateProjectUseCase: UpdateProjectUseCase,
    private _deleteProjectUseCase: DeleteProjectUseCase,
    private _getProjectUseCase: GetProjectUseCase,
  ) {}

  create = asyncHandler(async (req, res) => {
    const dto = CreateProjectDtoSchema.parse(req.body);
    const project = await this._createProjectUseCase.execute(
      dto,
      req.user!.sub
    );
    res.status(201).json({ success: true, data: project });
  });

  list = asyncHandler(async (req, res) => {
    const projects = await this._listProjectsUseCase.execute(req.user!.sub);
    res.status(200).json({ success: true, data: projects });
  });

  get = asyncHandler(async (req, res) => {
    const dto = GetProjectDtoSchema.parse(req.params);
    const project = await this._getProjectUseCase.execute(req.user!.sub, dto);
    res.status(200).json({ success: true, data: project });
  });

  update = asyncHandler(async (req, res) => {
    const params = GetProjectDtoSchema.parse(req.params);
    const dto = UpdateProjectDtoSchema.parse(req.body);
    const project = await this._updateProjectUseCase.execute(
      req.user!.sub,
      params.id,
      dto
    );
    res.status(200).json({ success: true, data: project });
  });

  delete = asyncHandler(async (req, res) => {
    const dto = DeleteProjectDtoSchema.parse(req.params);
    await this._deleteProjectUseCase.execute(req.user!.sub, dto);
    res.status(204).send();
  });
}
