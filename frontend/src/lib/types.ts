export type Role = "USER" | "ADMIN";

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface SessionUser {
  userId: string;
  email: string;
}

export interface Project {
  id: string;
  title: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  status: string;
  dueDate: Date;
}
