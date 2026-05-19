import { type TaskDTO } from "@domain/entities/task.entity";
import type { Logger } from "@application/ports/logger.port";
import type { TaskRepository } from "@domain/repositories/task.repository";

export class ListTasksUseCase {
    constructor(
        private readonly taskRepository: TaskRepository,
        private readonly logger: Logger
    ) {}

    async execute(userId: string, projectId: string): Promise<TaskDTO[]> {
        this.logger.info("List tasks attempt", {
            userId,
            projectId,
        });
        const tasks = await this.taskRepository.findByProject(userId, projectId);

        this.logger.info("Tasks fetched successfully", {
            userId,
            projectId,
            totalTasks: tasks.length,
        });

        return tasks.map(task => task.toPrimitives());
    }
}