import type { CreateProjectDto } from "@application/dtos/project/create-project.dto.js";
import { Project, type ProjectDTO } from "@domain/entities/project.entity.js";
import type { ProjectRepository } from "@domain/repositories/project.repository.js";

export class CreateProjectUseCase {
    constructor(private readonly projectRepository: ProjectRepository) {};

    async execute(input: CreateProjectDto, userId: string): Promise<ProjectDTO> {
        const project = Project.create({
            title: input.title,
            userId,
        });

        await this.projectRepository.save(project);

        return project.toPrimitives();
    }
}