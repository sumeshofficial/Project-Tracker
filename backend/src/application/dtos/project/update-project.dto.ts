import { z } from "zod";

export const UpdateProjectDtoSchema = z.object({
    title: z.string().min(5).max(150)
})

export type UpdateProjectDto = z.infer<typeof UpdateProjectDtoSchema>;