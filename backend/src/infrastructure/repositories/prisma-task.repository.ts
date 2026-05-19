import { Task } from "@domain/entities/task.entity";
import type { TaskRepository } from "@domain/repositories/task.repository";
import { prismaClient } from "@infrastructure/database/prisma/prisma.client";
import { TaskMapper } from "@infrastructure/mappers/task.mapper";

export class PrismaTaskRepository implements TaskRepository {
  async save(entity: Task): Promise<void> {
    await prismaClient.task.upsert({
      where: { id: entity.id },
      update: TaskMapper.toPersistence(entity),
      create: {
        ...TaskMapper.toPersistence(entity),
        createdAt: entity.createdAt,
      },
    });
  }

  async findById(userId: string, id: string): Promise<Task | null> {
    const task = await prismaClient.task.findFirst({
      where: { id, userId },
    });

    return task ? TaskMapper.toDomainTask(task) : null;
  }

  async findByProject(userId: string, projectId: string): Promise<Task[]> {
    const tasks = await prismaClient.task.findMany({
      where: { userId, projectId },
      orderBy: { createdAt: "desc" },
    });

    return tasks.map(TaskMapper.toDomainTask);
  }

  async delete(userId: string, id: string): Promise<void> {
    await prismaClient.task.deleteMany({ where: { id, userId } });
  }
}
