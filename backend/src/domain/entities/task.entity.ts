import type { TaskStatus } from "@domain/value-objects/task-status";
import { randomUUID } from "node:crypto";

export class Task {
  constructor(
    private readonly _id: string,
    private _title: string,
    private _status: TaskStatus,
    private readonly _userId: string,
    private readonly _projectId: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private _dueDate?: Date,
  ) {
    this.validateTitle(this._title);
  }

  private validateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error("Title cannot be empty");
    }

    if (title.length > 250) {
      throw new Error("Title cannot exceed 250 characters");
    }
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get status(): TaskStatus {
    return this._status;
  }

  get dueDate(): Date | undefined {
    return this._dueDate;
  }

  get userId(): string {
    return this._userId;
  }

  get projectId(): string {
    return this._projectId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  static create(data: {
    title: string;
    status: TaskStatus;
    dueDate?: Date;
    userId: string;
    projectId: string;
  }): Task {
    const now = new Date();
    return new Task(
      randomUUID(),
      data.title,
      data.status,
      data.userId,
      data.projectId,
      now,
      now,
      data.dueDate,
    );
  }

  rename(newTitle: string): void {
    this.validateTitle(newTitle);
    this._title = newTitle;
    this._updatedAt = new Date();
  }

  updateStatus(newStatus: TaskStatus): void {
    if (this._status.equals(newStatus)) return;
    this._status = newStatus;
    this._updatedAt = new Date();
  }

  updateDueDate(newDate: Date): void {
    this._dueDate = newDate;
    this._updatedAt = new Date();
  }

  toPrimitives() {
    return {
      id: this._id,
      title: this._title,
      status: this._status.getValue(),
      dueDate: this._dueDate,
      userId: this._userId,
      projectId: this._projectId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}

export type TaskDTO = ReturnType<typeof Task.prototype.toPrimitives>;