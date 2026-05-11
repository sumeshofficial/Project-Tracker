import { TaskNotFoundException } from "@application/errors/task/task-not-found.exception"
import type { TaskDTO } from "@domain/entities/task.entity";
import type { TaskRepository } from "@domain/repositories/task.repository";

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
