import { z } from "zod";

export const createCommentSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title can't exceed 200 characters"),
    userId: z.string().min(1, "User ID is required").max(500),
    todoId: z.string().min(1, "Todo ID is required").max(500),
    mentions: z.array(z.string()).optional()
});
