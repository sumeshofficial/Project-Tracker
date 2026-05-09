import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { toast } from "@/lib/toast";
import { useLogin } from "@/features/auth/auth-query";
import { ApiError } from "@/lib/api-client";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      await navigate({ to: "/" });
      await toast.success("Login successful");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold">Welcome Back</h1>

        <p className="mb-6 text-center text-sm text-gray-500">
          Login to your account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormField label="Email" error={errors.email?.message}>
            <div className="flex items-center rounded-lg border px-3">
              <Mail className="mr-2 h-5 w-5 text-gray-400" />

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full py-3 outline-none"
                {...register("email")}
              />
            </div>
          </FormField>

          <FormField label="Password" error={errors.password?.message}>
            <div className="flex items-center rounded-lg border px-3">
              <Lock className="mr-2 h-5 w-5 text-gray-400" />

              <input
                type="password"
                placeholder="Enter your password"
                className="w-full py-3 outline-none"
                {...register("password")}
              />
            </div>
          </FormField>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-black py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-black hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
