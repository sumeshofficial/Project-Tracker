import type { CreateTaskDto } from "@application/dtos/task/create-task.dto";
import { Task, type TaskDTO } from "@domain/entities/task.entity";
import type { TaskRepository } from "@domain/repositories/task.repository";
import { TaskStatus } from "@domain/value-objects/task-status";

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