import type { GetProjectDto } from "@application/dtos/project/get-project.dto";
import { ProjectNotFoundException } from "@application/errors/project/project-not-found.exception";
import type { Logger } from "@application/ports/logger.port";
import type { ProjectDTO } from "@domain/entities/project.entity";
import type { ProjectRepository } from "@domain/repositories/project.repository";

export class GetProjectUseCase {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly logger: Logger
  ) {}

  async execute(userId: string, input: GetProjectDto): Promise<ProjectDTO> {
    this.logger.info("Get project attempt", {
      userId,
      projectId: input.id,
    });

    const project = await this.projectRepository.findById(userId, input.id);

    if (!project) {
      throw new ProjectNotFoundException();
    }

    this.logger.info("Project fetched successfully", {
      userId,
      projectId: project.id,
      title: project.title,
    });

    return project.toPrimitives();
  }
}
