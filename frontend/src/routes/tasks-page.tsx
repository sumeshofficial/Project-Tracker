import {
  useDeleteTask,
  useListTasks,
  useUpdateTask,
} from "@/features/task/task-query";
import { FormField } from "@/components/ui/form-field";
import { toast } from "@/lib/toast";
import { Task } from "@/lib/types";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetProject } from "@/features/project/project-query";

const getStatusClassName = (status: Task["status"]) => {
  switch (status) {
    case "TODO":
      return "bg-yellow-100 text-yellow-700";

    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700";

    case "DONE":
      return "bg-green-100 text-green-700";

    default:
      return "bg-gray-200 text-gray-700";
  }
};

const updateTaskSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  dueDate: z.string().min(1, "Due date is required"),
});

type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;

export default function TasksPage() {
  const { id } = useParams({ from: "/app/projects/$id/tasks" });
  const getProject = useGetProject(id);
  const listTasks = useListTasks(id);
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateTaskFormData>({
    resolver: zodResolver(updateTaskSchema),
  });

  const openEditModal = (task: Task) => {
    setEditingTask(task);

    reset({
      title: task.title,
      status: task.status as "TODO" | "IN_PROGRESS" | "DONE",
      dueDate: new Date(task.dueDate).toISOString().split("T")[0],
    });
  };

  const closeEditModal = () => {
    setEditingTask(null);
    reset();
  };

  const onSubmit = async (data: UpdateTaskFormData) => {
    if (!editingTask) {
      return;
    }

    try {
      await updateTaskMutation.mutateAsync({
        taskId: editingTask.id,
        input: {
          title: data.title,
          status: data.status,
          dueDate: new Date(data.dueDate),
        },
      });

      toast.success("Task updated successfully");

      closeEditModal();
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async (taskId: string) => {
    const result = await toast.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!result.isConfirmed) {
      return;
    }

    try {
      await deleteTaskMutation.mutateAsync(taskId);

      toast.success("Task deleted successfully");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link
              to="/app/projects"
              className="mb-2 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-black"
            >
              <ArrowLeft size={16} />
              Back to Projects
            </Link>

            <h1 className="text-3xl font-bold">Tasks</h1>

            <p className="mt-1 text-sm text-gray-500">
              {getProject.isError
                ? "Project not found"
                : `Project: ${getProject.data?.title ?? "Loading project..."}`}
            </p>
          </div>

          <Link
            to="/app/projects/$id/tasks/new"
            params={{ id }}
            className="rounded-lg bg-black p-2 text-white transition hover:opacity-90"
          >
            <Plus size={20} />
          </Link>
        </div>

        {listTasks.data?.length === 0 ? (
          <div className="rounded-lg bg-white p-6 text-center shadow">
            <p className="text-gray-500">No tasks found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {listTasks.data?.map((task) => (
              <div key={task.id} className="rounded-lg bg-white p-4 shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{task.title}</h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Due Date: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusClassName(task.status)}`}
                    >
                      {task.status}
                    </span>

                    <button
                      onClick={() => openEditModal(task)}
                      className="rounded-lg bg-blue-500 p-2 text-white transition hover:opacity-90"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(task.id)}
                      disabled={deleteTaskMutation.isPending}
                      className="rounded-lg bg-red-500 p-2 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Edit Task</h1>

              <button
                onClick={closeEditModal}
                className="rounded-md p-2 text-gray-600 transition hover:bg-gray-100"
              >
                <X size={18} />
              </button>
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
                disabled={updateTaskMutation.isPending}
                className="w-full rounded-lg bg-black px-4 py-2 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updateTaskMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
