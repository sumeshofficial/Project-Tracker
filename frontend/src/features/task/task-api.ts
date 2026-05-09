import { apiFetch } from "@/lib/api-client";
import type { Task } from "@/lib/types";

export interface CreateTaskInput {
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate: Date;
}

export interface UpdateTaskInput {
  title?: string;
  status?: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate?: Date;
}

export const listTasks = (projectId: string) => {
  return apiFetch<Task[]>(`/api/projects/${projectId}/tasks`);
};

export const createTask = (projectId: string, input: CreateTaskInput) =>
  apiFetch<Task>(`/api/projects/${projectId}/tasks`, {
    method: "POST",
    body: JSON.stringify(input),
  });

export const updateTask = (taskId: string, input: UpdateTaskInput) =>
  apiFetch<Task>(`/api/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });

export const deleteTask = (taskId: string) =>
  apiFetch(`/api/tasks/${taskId}`, {
    method: "DELETE",
  });