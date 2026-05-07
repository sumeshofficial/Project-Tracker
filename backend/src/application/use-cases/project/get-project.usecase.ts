import type { GetProjectDto } from "@application/dtos/project/get-project.dto.js";
import { ProjectNotFoundException } from "@application/errors/project/project-not-found.exception.js";
import type { ProjectDTO } from "@domain/entities/project.entity.js";
import type { ProjectRepository } from "@domain/repositories/project.repository.js";

export class GetProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(userId: string, input: GetProjectDto): Promise<ProjectDTO> {
    const project = await this.projectRepository.findById(userId, input.id);

    if (!project) {
      throw new ProjectNotFoundException();
    }

    return project.toPrimitives();
  }
}
