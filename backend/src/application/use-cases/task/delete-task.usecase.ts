import { TaskNotFoundException } from "@application/errors/task/task-not-found.exception";
import type { TaskRepository } from "@domain/repositories/task.repository";

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(userId: string, taskId: string): Promise<void> {
    const task = await this.taskRepository.findById(userId, taskId);

    if (!task) {
      throw new TaskNotFoundException();
    }

    await this.taskRepository.delete(userId, taskId);
  }
}
