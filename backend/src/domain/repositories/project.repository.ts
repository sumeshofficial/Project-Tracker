import type { Project } from "@domain/entities/project.entity";
import { BaseRepository } from "@domain/repositories/base.repository";

export interface ProjectRepository extends BaseRepository<Project> {
  findMany(userId: string): Promise<Project[]>;

  exists(id: string, userId: string): Promise<boolean>;
}
