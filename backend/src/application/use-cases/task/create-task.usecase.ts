import type { CreateTaskDto } from "@application/dtos/task/create-task.dto.js";
import { Task, type TaskDTO } from "@domain/entities/task.entity.js";
import type { TaskRepository } from "@domain/repositories/task.repository.js";
import { TaskStatus } from "@domain/value-objects/task-status.js";

export class CreateTaskUseCase {
    constructor(private readonly taskRepository: TaskRepository) {};

    async execute(input: CreateTaskDto, userId: string, projectId: string): Promise<TaskDTO> {
        const task = Task.create({
            title: input.title,
            status: TaskStatus.fromValue(input.status),
            userId,
            projectId,
            ...(input.dueDate && { dueDate: input.dueDate }),
        });

        await this.taskRepository.save(task);

        return task.toPrimitives();
    }
}