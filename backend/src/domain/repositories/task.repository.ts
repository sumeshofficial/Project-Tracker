import type { Task } from "@domain/entities/task.entity";
import { BaseRepository } from "@domain/repositories/base.repository";

export interface TaskRepository extends BaseRepository<Task> {
  findByProject(userId: string, projectId: string): Promise<Task[]>;
}
