import type { Task } from "@domain/entities/task.entity.js";

export interface TaskRepository {
  save(task: Task): Promise<void>;
  findById(userId: string, id: string): Promise<Task | null>;
  findByProject(userId: string, projectId: string): Promise<Task[]>;
  delete(userId: string, id: string): Promise<void>;
}
