import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, User } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { useRegister } from "@/features/auth/auth-query";
import { ApiError } from "@/lib/api-client";
import { toast } from "@/lib/toast";

const registerSchema = z.object({
  fullname: z.string().trim().min(3, "Full name must be at least 3 characters"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync(data);
      await toast.success("User registered");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    }

    await navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold">Create Account</h1>

        <p className="mb-6 text-center text-sm text-gray-500">
          Register to continue
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormField label="Full Name" error={errors.fullname?.message}>
            <div className="flex items-center rounded-lg border px-3">
              <User className="mr-2 h-5 w-5 text-gray-400" />

              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full py-3 outline-none"
                {...register("fullname")}
              />
            </div>
          </FormField>

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
            {isSubmitting ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-black hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
