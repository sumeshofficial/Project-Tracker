import type { UpdateTaskDto } from "@application/dtos/task/update-task.dto.js";
import { TaskNotFoundException } from "@application/errors/task/task-not-found.exception.js";
import type { TaskDTO } from "@domain/entities/task.entity.js";
import type { TaskRepository } from "@domain/repositories/task.repository.js";
import { TaskStatus } from "@domain/value-objects/task-status.js";

export class UpdateTaskUseCase {
    constructor(private readonly taskRepository: TaskRepository) {};

    async execute(userId: string, taskId: string, input: UpdateTaskDto): Promise<TaskDTO> {
        const task = await this.taskRepository.findById(userId, taskId);

        if (!task) {
            throw new TaskNotFoundException();
        };

        if (input.title !== undefined) {
            task.rename(input.title);
        }

        if (input.status !== undefined) {
            task.updateStatus(TaskStatus.fromValue(input.status));
        }

        if (input.dueDate !== undefined) {
            task.updateDueDate(input.dueDate);
        }

        await this.taskRepository.save(task);

        return task.toPrimitives();
    }
}