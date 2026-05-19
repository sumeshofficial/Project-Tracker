import type { CreateProjectDto } from "@application/dtos/project/create-project.dto";
import type { Logger } from "@application/ports/logger.port";
import { Project, type ProjectDTO } from "@domain/entities/project.entity";
import type { ProjectRepository } from "@domain/repositories/project.repository";

export class CreateProjectUseCase {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly logger: Logger
    ) {}

    async execute(input: CreateProjectDto, userId: string): Promise<ProjectDTO> {
        this.logger.info("Project creation attempt", {
            userId,
            title: input.title,
        });

        const project = Project.create({
            title: input.title,
            userId,
        });

        await this.projectRepository.save(project);

        this.logger.info("Project created successfully", {
            projectId: project.id,
            userId,
            title: project.title,
        });

        return project.toPrimitives();
    }
}