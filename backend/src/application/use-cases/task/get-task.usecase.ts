import { TaskNotFoundException } from "@application/errors/task/task-not-found.exception"
import type { Logger } from "@application/ports/logger.port";
import type { TaskDTO } from "@domain/entities/task.entity";
import type { TaskRepository } from "@domain/repositories/task.repository";

export class GetTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly logger: Logger
  ) {}

  async execute(userId: string, taskId: string): Promise<TaskDTO> {
    this.logger.info("Get task attempt", {
      userId,
      taskId,
    });

    const task = await this.taskRepository.findById(userId, taskId);

    if (!task) {
      throw new TaskNotFoundException();
    }

    this.logger.info("Task fetched successfully", {
      userId,
      taskId: task.id,
      title: task.title,
      status: task.status.getValue(),
    });

    return task.toPrimitives();
  }
}
