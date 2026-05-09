import { apiFetch } from "@/lib/api-client";
import type { Project } from "@/lib/types";

export interface CreateProjectInput {
  title: string;
}

export interface UpdateProjectInput {
  title?: string;
}

export const listProjects = () => {
  return apiFetch<Project[]>("/api/projects");
};

export const createProject = (input: CreateProjectInput) =>
  apiFetch<Project>("/api/projects", {
    method: "POST",
    body: JSON.stringify(input),
  });

export const updateProject = (projectId: string, input: UpdateProjectInput) =>
  apiFetch<Project>(`/api/projects/${projectId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });

export const deleteProject = (projectId: string) =>
  apiFetch(`/api/projects/${projectId}`, {
    method: "DELETE",
  });