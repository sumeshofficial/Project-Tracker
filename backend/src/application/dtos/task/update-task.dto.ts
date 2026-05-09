import { z } from "zod";

export const UpdateTaskDtoSchema = z
  .object({
    title: z.string().trim().min(5).max(150).optional(),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
    dueDate: z.coerce.date().optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.status !== undefined ||
      data.dueDate !== undefined,
    { message: "At least one field must be provided" }
  );

export type UpdateTaskDto = z.infer<typeof UpdateTaskDtoSchema>;
