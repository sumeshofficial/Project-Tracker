import { TaskNotFoundException } from "@application/errors/task/task-not-found.exception";
import type { TaskRepository } from "@domain/repositories/task.repository";
import type { Logger } from "@application/ports/logger.port";

export class DeleteTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly logger: Logger
  ) {}

  async execute(userId: string, taskId: string): Promise<void> {
    this.logger.info("Task deletion attempt", {
      userId,
      taskId,
    });

    const task = await this.taskRepository.findById(userId, taskId);

    if (!task) {
      throw new TaskNotFoundException();
    }

    await this.taskRepository.delete(userId, taskId);
    this.logger.info("Task deleted successfully", {
      userId,
      taskId,
    });
  }
}
