import { Task } from "@domain/entities/task.entity";
import type { TaskRepository } from "@domain/repositories/task.repository";
import { TaskStatus } from "@domain/value-objects/task-status";
import { prismaClient } from "@infrastructure/database/prisma/prisma.client";
import type { Prisma } from "@prisma/client";
import type { Task as PrismaTask } from "@prisma/client";

type PrismaTaskRow = PrismaTask;

const toDomainTask = (row: PrismaTaskRow): Task => {
  return new Task(
    row.id,
    row.title,
    TaskStatus.fromValue(row.status),
    row.userId,
    row.projectId,
    row.createdAt,
    row.updatedAt,
    row.dueDate ?? undefined
  );
};

const toPersistence = (task: Task): Prisma.TaskUncheckedCreateInput => ({
  id: task.id,
  title: task.title,
  status: task.status.getValue(),
  userId: task.userId,
  projectId: task.projectId,
  ...(task.dueDate !== undefined && { dueDate: task.dueDate }),
});

export class PrismaTaskRepository implements TaskRepository {
  async save(task: Task): Promise<void> {
    await prismaClient.task.upsert({
      where: { id: task.id },
      update: toPersistence(task),
      create: {
        ...toPersistence(task),
        createdAt: task.createdAt,
      },
    });
  }

  async findById(userId: string, id: string): Promise<Task | null> {
    const task = await prismaClient.task.findFirst({
      where: { id, userId },
    });

    return task ? toDomainTask(task) : null;
  }

  async findByProject(userId: string, projectId: string): Promise<Task[]> {
    const tasks = await prismaClient.task.findMany({
      where: { userId, projectId },
      orderBy: { createdAt: "desc" },
    });

    return tasks.map(toDomainTask);
  }

  async delete(userId: string, id: string): Promise<void> {
    await prismaClient.task.deleteMany({ where: { id, userId } });
  }
}
