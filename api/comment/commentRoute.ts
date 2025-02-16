import { Router } from "express";
import { createComment, getAllCommentsByTodo, getCommentDetails, updateComment, deleteComment } from './commentController';
import { validateRequest } from "../middleware/validationMiddleware";
import { createCommentSchema } from "./commentSchema";

const router = Router();

router.post("/", validateRequest(createCommentSchema), createComment);
router.get("/:id", getAllCommentsByTodo);
router.patch("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;