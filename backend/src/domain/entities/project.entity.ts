import { randomUUID } from "node:crypto";

export class Project {
  constructor(
    private readonly _id: string,
    private _title: string,
    private readonly _userId: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {
    this.validateTitle(this._title);
  }

  private validateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error("Title cannot be empty");
    }

    if (title.length > 150) {
      throw new Error("Title cannot exceed 150 characters");
    }
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get userId(): string {
    return this._userId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  static create(data: {
    title: string;
    userId: string;
  }): Project {
    const now = new Date();
    return new Project(
      randomUUID(),
      data.title,
      data.userId,
      now,
      now
    );
  }

  rename(newtitle: string): void {
    this.validateTitle(newtitle);
    this._title = newtitle;
    this._updatedAt = new Date();
  }

  toPrimitives() {
    return {
      id: this._id,
      title: this._title,
      userId: this._userId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}

export type ProjectDTO = ReturnType<typeof Project.prototype.toPrimitives>;