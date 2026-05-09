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
