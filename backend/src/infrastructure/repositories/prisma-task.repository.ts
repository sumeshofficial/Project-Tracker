import { Task } from "@domain/entities/task.entity";
import type { TaskRepository } from "@domain/repositories/task.repository";
import { prismaClient } from "@infrastructure/database/prisma/prisma.client";
import { TaskMapper } from "@infrastructure/mappers/task.mapper";


export class PrismaTaskRepository implements TaskRepository {
  async save(task: Task): Promise<void> {
    await prismaClient.task.upsert({
      where: { id: task.id },
      update: TaskMapper.toPersistence(task),
      create: {
        ...TaskMapper.toPersistence(task),
        createdAt: task.createdAt,
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
