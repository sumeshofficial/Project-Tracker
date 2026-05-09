import { z } from "zod";

export const GetTaskDtoSchema = z.object({
  id: z.uuid(),
});

export type GetTaskDto = z.infer<typeof GetTaskDtoSchema>;