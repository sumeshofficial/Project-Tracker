import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/ui/form-field";
import { toast } from "@/lib/toast";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import {
  useDeleteProject,
  useListProjects,
  useUpdateProject,
} from "@/features/project/project-query";
import { useState } from "react";
import { Project } from "@/lib/types";

const editProjectSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
});

type EditProjectFormData = z.infer<typeof editProjectSchema>;

export default function ProjectsPage() {
  const [editingProject, setEditingProject] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const listProjectQuery = useListProjects();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProjectFormData>({
    resolver: zodResolver(editProjectSchema),
  });

  const openEditModal = (project: { id: string; title: string }) => {
    setEditingProject(project);

    reset({
      title: project.title,
    });
  };

  const closeEditModal = () => {
    setEditingProject(null);
    reset();
  };

  const onSubmit = async (data: EditProjectFormData) => {
    if (!editingProject) {
      return;
    }

    try {
      await updateProjectMutation.mutateAsync({
        projectId: editingProject.id,
        input: {
          title: data.title,
        },
      });

      toast.success("Project updated successfully");

      closeEditModal();
    } catch {
      toast.error("Failed to update project");
    }
  };

  const handleDelete = async (projectId: string) => {
    const result = await toast.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!result.isConfirmed) {
      return;
    }

    try {
      await deleteProjectMutation.mutateAsync(projectId);

      toast.success("Project deleted successfully");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Projects</h1>

            <Link
              to="/app/projects/new"
              className="rounded-lg bg-black p-2 text-white transition hover:opacity-90"
            >
              <Plus size={20} />
            </Link>
          </div>

          {listProjectQuery.isLoading ? (
            <div className="rounded-lg bg-white p-6 text-center shadow">
              <p className="text-gray-500">Loading projects...</p>
            </div>
          ) : listProjectQuery.data?.length === 0 ? (
            <div className="rounded-lg bg-white p-6 text-center shadow">
              <p className="text-gray-500">No projects found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {listProjectQuery.data?.map((project: Project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between rounded-lg bg-white p-4 shadow"
                >
                  <div>
                    <Link
                      to="/app/projects/$id/tasks"
                      params={{ id: project.id }}
                      className="text-lg font-semibold transition hover:underline"
                    >
                      {project.title}
                    </Link>

                    <p className="mt-1 text-sm text-gray-500">
                      Created at:{" "}
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(project)}
                      className="rounded-lg bg-blue-500 p-2 text-white transition hover:opacity-90"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={deleteProjectMutation.isPending}
                      className="rounded-lg bg-red-500 p-2 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {editingProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Edit Project</h1>

              <button
                onClick={closeEditModal}
                className="rounded-md p-2 text-gray-600 transition hover:bg-gray-100"
              >
                <X size={18} />
              </button>
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
                disabled={updateProjectMutation.isPending}
                className="w-full rounded-lg bg-black px-4 py-2 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updateProjectMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
