import { z } from "zod";

export const createTodoSchema = z.object({
    title: z.string().min(3).max(200),
    description : z.string().min(0).max(500)
});
