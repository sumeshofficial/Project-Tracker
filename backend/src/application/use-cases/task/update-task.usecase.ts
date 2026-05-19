import type { UpdateTaskDto } from "@application/dtos/task/update-task.dto";
import { TaskNotFoundException } from "@application/errors/task/task-not-found.exception";
import type { Logger } from "@application/ports/logger.port";
import type { TaskDTO } from "@domain/entities/task.entity";
import type { TaskRepository } from "@domain/repositories/task.repository";
import { TaskStatus } from "@domain/value-objects/task-status";

export class UpdateTaskUseCase {
    constructor(
        private readonly taskRepository: TaskRepository,
        private readonly logger: Logger
    ) {}

    async execute(userId: string, taskId: string, input: UpdateTaskDto): Promise<TaskDTO> {
        this.logger.info("Task update attempt", {
            userId,
            taskId,
            title: input.title,
            status: input.status,
        });

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

        this.logger.info("Task updated successfully", {
            userId,
            taskId: task.id,
            title: task.title,
            status: task.status.getValue(),
        });

        return task.toPrimitives();
    }
}