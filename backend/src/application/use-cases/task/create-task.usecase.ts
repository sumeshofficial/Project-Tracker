import type { CreateTaskDto } from "@application/dtos/task/create-task.dto";
import type { Logger } from "@application/ports/logger.port";
import { Task, type TaskDTO } from "@domain/entities/task.entity";
import type { TaskRepository } from "@domain/repositories/task.repository";
import { TaskStatus } from "@domain/value-objects/task-status";

export class CreateTaskUseCase {
    constructor(
        private readonly taskRepository: TaskRepository,
        private readonly logger: Logger
    ) {}

    async execute(input: CreateTaskDto, userId: string, projectId: string): Promise<TaskDTO> {
        this.logger.info("Task creation attempt", {
            userId,
            projectId,
            title: input.title,
            status: input.status,
        });

        const task = Task.create({
            title: input.title,
            status: TaskStatus.fromValue(input.status),
            userId,
            projectId,
            ...(input.dueDate && { dueDate: input.dueDate }),
        });

        await this.taskRepository.save(task);

        this.logger.info("Task created successfully", {
            taskId: task.id,
            userId,
            projectId,
            title: task.title,
            status: task.status.getValue(),
        });

        return task.toPrimitives();
    }
}