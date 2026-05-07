import type { Project } from "@domain/entities/project.entity.js";

export interface ProjectRepository {
  save(project: Project): Promise<void>;
  findById(userId: string, id: string): Promise<Project | null>;
  delete(userId: string, id: string): Promise<void>;
  findMany(userId: string): Promise<Project[]>;
  exists(id: string, userId: string): Promise<boolean>;
}