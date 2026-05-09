import { z } from "zod";

export const CreateTaskDtoSchema = z.object({
    title: z.string().min(5).max(150),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
    dueDate: z.coerce.date().optional(),
})

export type CreateTaskDto = z.infer<typeof CreateTaskDtoSchema>;