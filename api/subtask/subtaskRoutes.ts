import { Router } from "express";
import { createSubtask, getAllSubtasksByTodo, updateSubtask, deleteSubtask } from "./subtaskController";
import { validateRequest } from "../middleware/validationMiddleware";
import { createSubtaskSchema } from "./subtaskSchema";

const router = Router();

router.post("/", validateRequest(createSubtaskSchema), createSubtask);
router.get("/:id", getAllSubtasksByTodo);
router.patch("/:id", updateSubtask);
router.delete("/:id", deleteSubtask);

export default router;