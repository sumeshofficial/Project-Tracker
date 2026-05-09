import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, CreateTaskInput, deleteTask, listTasks, updateTask, UpdateTaskInput } from "@/features/task/task-api";

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({projectId, input}: {projectId: string, input: CreateTaskInput}) => createTask(projectId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      input,
    }: {
      taskId: string;
      input: UpdateTaskInput;
    }) => updateTask(taskId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useListTasks = (projectId: string) => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: () => listTasks(projectId),
    enabled: !!projectId
  });
};
