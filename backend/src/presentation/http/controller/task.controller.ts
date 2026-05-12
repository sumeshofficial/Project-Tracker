import type { Request, Response } from "express";
import { DeleteTaskUseCase } from "@application/use-cases/task/delete-task.usecase";
import { GetTaskUseCase } from "@application/use-cases/task/get-task.usecase";
import { UpdateTaskUseCase } from "@application/use-cases/task/update-task.usecase"
import { GetProjectDtoSchema } from "@application/dtos/project/get-project.dto";
import { CreateTaskDtoSchema } from "@application/dtos/task/create-task.dto";
import { CreateTaskUseCase } from "@application/use-cases/task/create-task.usecase";
import { ListTasksUseCase } from "@application/use-cases/task/list-tasks.usecase";
import { GetTaskDtoSchema } from "@application/dtos/task/get-task.dto";
import { UpdateTaskDtoSchema } from "@application/dtos/task/update-task.dto";
import { HttpStatusCode } from "@shared/constants/http-status";

export class TaskController {
  constructor(
    private _createTaskUseCase: CreateTaskUseCase,
    private _listTasksUseCase: ListTasksUseCase,
    private _updateTaskUseCase: UpdateTaskUseCase,
    private _deleteTaskUseCase: DeleteTaskUseCase,
    private _getTaskUseCase: GetTaskUseCase
  ) {}

  create = async (req: Request, res: Response) => {
    const params = GetProjectDtoSchema.parse(req.params);
    const dto = CreateTaskDtoSchema.parse(req.body);
    const task = await this._createTaskUseCase.execute(
      dto,
      req.user!.sub,
      params.id
    );
    res.status(HttpStatusCode.CREATED).json({ success: true, data: task });
  };

  list = async (req: Request, res: Response) => {
    const params = GetProjectDtoSchema.parse(req.params);
    const tasks = await this._listTasksUseCase.execute(
      req.user!.sub,
      params.id
    );
    res.status(HttpStatusCode.OK).json({ success: true, data: tasks });
  };

  get = async (req: Request, res: Response) => {
    const params = GetTaskDtoSchema.parse(req.params);
    const task = await this._getTaskUseCase.execute(req.user!.sub, params.id);
    res.status(HttpStatusCode.OK).json({ success: true, data: task });
  };

  update = async (req: Request, res: Response) => {
    const params = GetTaskDtoSchema.parse(req.params);
    const dto = UpdateTaskDtoSchema.parse(req.body);
    const task = await this._updateTaskUseCase.execute(
      req.user!.sub,
      params.id,
      dto
    );
    res.status(HttpStatusCode.OK).json({ success: true, data: task });
  };

  delete = async (req: Request, res: Response) => {
    const params = GetTaskDtoSchema.parse(req.params);
    await this._deleteTaskUseCase.execute(req.user!.sub, params.id);
    res.status(HttpStatusCode.NO_CONTENT).send();
  };
}
