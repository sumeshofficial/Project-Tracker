import type { DeleteProjectDto } from "@application/dtos/project/delete-project.dto";
import { ProjectNotFoundException } from "@application/errors/project/project-not-found.exception";
import type { Logger } from "@application/ports/logger.port";
import type { ProjectRepository } from "@domain/repositories/project.repository";

export class DeleteProjectUseCase {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly logger: Logger
  ) {}

  async execute(userId: string, input: DeleteProjectDto): Promise<void> {
    this.logger.info("Project deletion attempt", {
      userId,
      projectId: input.id,
    });

    const project = await this.projectRepository.findById(userId, input.id);

    if (!project) {
      throw new ProjectNotFoundException();
    }

    await this.projectRepository.delete(userId, input.id);
    this.logger.info("Project deleted successfully", {
      userId,
      projectId: input.id,
    });
  }
}