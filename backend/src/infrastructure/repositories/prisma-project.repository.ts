import { Project } from "@domain/entities/project.entity";
import type { ProjectRepository } from "@domain/repositories/project.repository";
import { prismaClient } from "@infrastructure/database/prisma/prisma.client";
import { ProjectMapper } from "@infrastructure/mappers/project.mapper";

export class PrismaProjectRepository implements ProjectRepository {
  async save(project: Project): Promise<void> {
    await prismaClient.project.upsert({
      where: { id: project.id },
      update: ProjectMapper.toPersistence(project),
      create: {
        ...ProjectMapper.toPersistence(project),
        createdAt: project.createdAt,
      },
    });
  }

  async findById(userId: string, id: string): Promise<Project | null> {
    const project = await prismaClient.project.findFirst({
      where: { id, userId },
    });

    return project ? ProjectMapper.toDomainProject(project) : null;
  }

  async findMany(userId: string): Promise<Project[]> {
    const projects = await prismaClient.project.findMany({ where: { userId } });

    return projects.map(ProjectMapper.toDomainProject);
  }

  async exists(id: string, userId: string): Promise<boolean> {
    const count = await prismaClient.project.count({
      where: { id, userId },
    });

    return count > 0;
  }

  async delete(userId: string, id: string): Promise<void> {
    await prismaClient.project.deleteMany({ where: { id, userId } });
  }
}
