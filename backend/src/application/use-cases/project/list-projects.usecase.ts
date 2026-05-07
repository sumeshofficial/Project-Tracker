import type { ProjectDTO } from "@domain/entities/project.entity.js";
import type { ProjectRepository } from "@domain/repositories/project.repository.js";

export class ListProjectsUseCase {
    constructor(private readonly projectRepository: ProjectRepository) {};
    
    async execute(userId: string): Promise<ProjectDTO[]> {
        const result = await this.projectRepository.findMany(userId);

        return result.map(project => project.toPrimitives());
    }
}