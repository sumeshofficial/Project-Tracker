import type { UpdateProjectDto } from "@application/dtos/project/update-project.dto";
import { ProjectNotFoundException } from "@application/errors/project/project-not-found.exception";
import type { ProjectDTO } from "@domain/entities/project.entity";
import type { ProjectRepository } from "@domain/repositories/project.repository";

export class UpdateProjectUseCase {
    constructor(private readonly projectRepository: ProjectRepository) {};

    async execute(userId: string, projectId: string, input: UpdateProjectDto): Promise<ProjectDTO> {
        const project = await this.projectRepository.findById(userId, projectId);

        if (!project) {
            throw new ProjectNotFoundException();
        };

        project.rename(input.title);

        await this.projectRepository.save(project);

        return project.toPrimitives();
    }
}