import { apiFetch } from "@/lib/api-client";
import { setAccessToken } from "./auth-storage";
import { SessionUser } from "@/lib/types";

export interface RegisterInput {
  fullname: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const register = async (input: RegisterInput): Promise<void> => {
  await apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  }, false);
};

export const login = async (input: LoginInput): Promise<void> => {
  const data = await apiFetch<{ accessToken: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  }, false);

  setAccessToken(data.accessToken);
};

export const fetchMe = () => apiFetch<SessionUser>("/api/auth/me");