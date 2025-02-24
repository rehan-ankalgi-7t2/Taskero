import { z } from "zod";

export const createTodoSchema = z.object({
    title: z.string().min(3).max(200),
    description : z.string().min(0).max(500),
    deadline: z.date().optional(),
    subtasks: z.array(z.object({
        subtaskTitle: z.string()
    })).optional(),
    createdBy: z.string().optional(),
});
