import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { X } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { useCreateTask } from "@/features/task/task-query";
import { toast } from "@/lib/toast";

const createTaskSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  dueDate: z.string().min(1, "Due date is required"),
});

type CreateTaskFormData = z.infer<typeof createTaskSchema>;

export default function NewTaskPage() {
  const createTaskMutation = useCreateTask();
  const navigate = useNavigate();
  const { id } = useParams({
    from: "/app/projects/$id/tasks/new",
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      status: "TODO",
      dueDate: "",
    },
  });

  const onSubmit = async (data: CreateTaskFormData) => {
    try {
      await createTaskMutation.mutateAsync({
        projectId: id,
        input: {
          title: data.title,
          status: data.status,
          dueDate: new Date(data.dueDate),
        },
      });
      reset();
      await navigate({
        to: "/app/projects/$id/tasks",
        params: { id },
      });
      toast.success("Task created successfully");
    } catch {
      toast.error("Failed to create task");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create Task</h1>

          <Link
            to=".."
            className="rounded-md p-2 text-gray-600 transition hover:bg-gray-100"
          >
            <X size={18} />
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Task Title" error={errors.title?.message}>
            <input
              type="text"
              placeholder="Enter task title"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
              {...register("title")}
            />
          </FormField>

          <FormField label="Status" error={errors.status?.message}>
            <select
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
              {...register("status")}
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </FormField>

          <FormField label="Due Date" error={errors.dueDate?.message}>
            <input
              type="date"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
              {...register("dueDate")}
            />
          </FormField>

          <button
            type="submit"
            disabled={createTaskMutation.isPending}
            className="w-full rounded-lg bg-black px-4 py-2 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createTaskMutation.isPending ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
}
