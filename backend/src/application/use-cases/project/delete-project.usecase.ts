import type { DeleteProjectDto } from "@application/dtos/project/delete-project.dto.js";
import { ProjectNotFoundException } from "@application/errors/project/project-not-found.exception.js";
import type { ProjectRepository } from "@domain/repositories/project.repository.js";

export class DeleteProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(userId: string, input: DeleteProjectDto): Promise<void> {
    const project = await this.projectRepository.findById(userId, input.id);

    if (!project) {
      throw new ProjectNotFoundException();
    }

    await this.projectRepository.delete(userId, input.id);
  }
}