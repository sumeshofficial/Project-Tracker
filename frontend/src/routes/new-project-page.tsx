import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/ui/form-field";
import { Link, useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useCreateProject } from "@/features/project/project-query";
import { toast } from "@/lib/toast";
import { ApiError } from "@/lib/api-client";

const createProjectSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
});

type CreateProjectFormData = z.infer<typeof createProjectSchema>;

export default function NewProjectPage() {
  const navigate = useNavigate();
  const createProjectMutation = useCreateProject();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (data: CreateProjectFormData) => {
    try {
      await createProjectMutation.mutateAsync(data);
      await navigate({ to: "/app/projects" });
      toast.success("Project created");
      reset();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create Project</h1>

          <Link
            to="/app/projects"
            className="rounded-md px-3 py-1 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          >
            <X />
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Project Title" error={errors.title?.message}>
            <input
              type="text"
              placeholder="Enter project title"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
              {...register("title")}
            />
          </FormField>

          <button
            type="submit"
            disabled={createProjectMutation.isPending}
            className="w-full rounded-lg bg-black px-4 py-2 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createProjectMutation.isPending ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
}
