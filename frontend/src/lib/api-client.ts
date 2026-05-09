import { getAccessToken, clearAccessToken } from "@/features/auth/auth-storage";
import type { ApiEnvelope } from "@/lib/types";

const configuredApiBaseUrl =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";

// In local dev, prefer Vite proxy to avoid CORS/preflight issues for auth-protected routes.
const API_BASE_URL = import.meta.env.DEV ? "" : configuredApiBaseUrl;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiErrorEnvelope {
  success: false;
  code?: string;
  message?: string;
  error?: string;
  details?: {
    formErrors?: string[];
    fieldErrors?: Record<string, string[]>;
  };
}

const resolveUrl = (path: string): string => {
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
};

const extractDetailedErrorMessage = (payload: ApiErrorEnvelope | ApiEnvelope<unknown> | null) => {
  if (!payload || !("details" in payload) || !payload.details) return undefined;

  const formError = payload.details.formErrors?.find(Boolean);
  if (formError) return formError;

  const fieldErrors = payload.details.fieldErrors;
  if (!fieldErrors) return undefined;

  for (const messages of Object.values(fieldErrors)) {
    const firstMessage = messages?.find(Boolean);
    if (firstMessage) return firstMessage;
  }

  return undefined;
};

export const apiFetch = async <T>(
  path: string,
  init: RequestInit = {},
  auth = true,
): Promise<T> => {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");

  if (auth) {
    const token = getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(resolveUrl(path), {
    ...init,
    headers,
  });

  const payload = (await response.json().catch(() => null)) as
    | ApiEnvelope<T>
    | ApiErrorEnvelope
    | null;
  const detailedMessage = extractDetailedErrorMessage(payload);
  const message =
    detailedMessage ||
    (payload && "message" in payload ? payload.message : undefined) ||
    (payload && "error" in payload ? payload.error : undefined) ||
    `Request failed with status ${response.status}`;

  if (!response.ok || !payload?.success) {
    if (response.status === 401) {
      clearAccessToken();
    }
    throw new ApiError(message, response.status);
  }

  return payload.data;
};