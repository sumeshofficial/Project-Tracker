import { z } from "zod";

export const CreateProjectDtoSchema = z.object({
    title: z.string().min(5).max(150),
})

export type CreateProjectDto = z.infer<typeof CreateProjectDtoSchema>;