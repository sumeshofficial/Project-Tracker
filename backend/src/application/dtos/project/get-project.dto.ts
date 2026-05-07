import { z } from "zod";

export const GetProjectDtoSchema = z.object({
    id: z.string().min(1),
})

export type GetProjectDto = z.infer<typeof GetProjectDtoSchema>;