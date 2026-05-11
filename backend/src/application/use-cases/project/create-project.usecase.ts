import type { CreateProjectDto } from "@application/dtos/project/create-project.dto";
import { Project, type ProjectDTO } from "@domain/entities/project.entity";
import type { ProjectRepository } from "@domain/repositories/project.repository";

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