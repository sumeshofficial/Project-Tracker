import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchMe,
  login,
  LoginInput,
  register,
  RegisterInput,
} from "@/features/auth/auth-api";
import { clearAccessToken, getAccessToken } from "@/features/auth/auth-storage";
import { ApiError } from "@/lib/api-client";

export const useRegister = () => {
  return useMutation({
    mutationFn: (input: RegisterInput) => register(input),
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["session"] });
    },
  });
};

export const sessionQueryOptions = () =>
  queryOptions({
    queryKey: ["session"],
    queryFn: async () => {
      if (!getAccessToken()) {
        return null;
      }

      try {
        return fetchMe();
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          clearAccessToken();
          return null;
        }
        return null;
      }
    },
  });

export const useSession = () => useQuery(sessionQueryOptions());

export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    clearAccessToken();
    void queryClient.setQueryData(["session"], null);
    void queryClient.invalidateQueries({ queryKey: ["session"] });
  };
};