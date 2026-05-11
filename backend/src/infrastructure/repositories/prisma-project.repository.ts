import { Project } from "@domain/entities/project.entity";
import type { ProjectRepository } from "@domain/repositories/project.repository";
import { prismaClient } from "@infrastructure/database/prisma/prisma.client";
import type { Prisma } from "@prisma/client";

type PrismaProjectRow = NonNullable<
  Awaited<ReturnType<typeof prismaClient.project.findFirst>>
>;

const toDomainProject = (row: PrismaProjectRow): Project => {
  return new Project(
    row.id,
    row.title,
    row.userId,
    row.createdAt,
    row.updatedAt
  );
};

const toPersistence = (
  project: Project
): Prisma.ProjectUncheckedCreateInput => ({
  id: project.id,
  title: project.title,
  userId: project.userId,
  updatedAt: project.updatedAt,
});

export class PrismaProjectRepository implements ProjectRepository {
  async save(project: Project): Promise<void> {
    await prismaClient.project.upsert({
      where: { id: project.id },
      update: toPersistence(project),
      create: {
        ...toPersistence(project),
        createdAt: project.createdAt,
      },
    });
  }

  async findById(userId: string, id: string): Promise<Project | null> {
    const project = await prismaClient.project.findFirst({
      where: { id, userId },
    });

    return project ? toDomainProject(project) : null;
  }

  async findMany(userId: string): Promise<Project[]> {
    const projects = await prismaClient.project.findMany({ where: { userId } });

    return projects.map(toDomainProject);
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
