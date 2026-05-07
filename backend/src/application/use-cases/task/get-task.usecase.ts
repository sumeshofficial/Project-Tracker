import { TaskNotFoundException } from "@application/errors/task/task-not-found.exception.js"
import type { TaskDTO } from "@domain/entities/task.entity.js";
import type { TaskRepository } from "@domain/repositories/task.repository.js";

export class GetTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(userId: string, taskId: string): Promise<TaskDTO> {
    const task = await this.taskRepository.findById(userId, taskId);

    if (!task) {
      throw new TaskNotFoundException();
    }

    return task.toPrimitives();
  }
}
