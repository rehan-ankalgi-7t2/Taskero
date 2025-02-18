import { z } from "zod";

export const createSubtaskSchema = z.object({
    subtaskTitle: z.string().min(3).max(200),
    todoId: z.string()
});
