import { Router } from "express";
import { createTodo, getAllTodo, getTodoDetails, updateTodo, deleteTodo } from "./todoController";
import { validateRequest } from "../middleware/validationMiddleware";
import { createTodoSchema } from "./todoSchema";

const router = Router();

router.post("/", validateRequest(createTodoSchema), createTodo);
router.get("/", getAllTodo);
router.get("/:id", getTodoDetails);
router.patch("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;