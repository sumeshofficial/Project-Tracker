import { type TaskDTO } from "@domain/entities/task.entity";
import type { TaskRepository } from "@domain/repositories/task.repository";

export class ListTasksUseCase {
    constructor(private readonly taskRepository: TaskRepository) {};

    async execute(userId: string, projectId: string): Promise<TaskDTO[]> {
        const tasks = await this.taskRepository.findByProject(userId, projectId);

        return tasks.map(task => task.toPrimitives());
    }
}