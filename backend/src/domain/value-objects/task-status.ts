export type TaskStatusType = "TODO" | "IN_PROGRESS" | "DONE";

export class TaskStatus {

  private constructor(private readonly value: TaskStatusType) 
  {}

  static todo(): TaskStatus {
    return new TaskStatus("TODO");
  }

  static in_progress(): TaskStatus {
    return new TaskStatus("IN_PROGRESS");
  }

  static done(): TaskStatus {
    return new TaskStatus("DONE");
  }

  static fromValue(value: TaskStatusType): TaskStatus {
    switch (value) {
      case "TODO":
        return TaskStatus.todo();
      case "IN_PROGRESS":
        return TaskStatus.in_progress();
      case "DONE":
        return TaskStatus.done();
    }
  }

  getValue(): TaskStatusType {
    return this.value;
  }

  equals(other: TaskStatus): boolean {
    return this.value === other.value;
  }
}