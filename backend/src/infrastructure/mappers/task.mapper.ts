import { Task } from "@domain/entities/task.entity";
import { TaskStatus } from "@domain/value-objects/task-status";
import type { Prisma, Task as PrismaTask } from "@prisma/client";

type PrismaTaskRow = PrismaTask;

export class TaskMapper {
  static toDomainTask(row: PrismaTaskRow): Task {
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
  }

  static toPersistence(task: Task): Prisma.TaskUncheckedCreateInput {
    return {
      id: task.id,
      title: task.title,
      status: task.status.getValue(),
      userId: task.userId,
      projectId: task.projectId,
      ...(task.dueDate !== undefined && { dueDate: task.dueDate }),
    };
  }
}