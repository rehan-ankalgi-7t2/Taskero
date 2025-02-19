import { Router } from "express";
import {
    createReminder,
    getReminders,
    getReminderById,
    updateReminder,
    deleteReminder,
} from "./reminderController";
import { validateRequest } from "../middleware/validationMiddleware";

const router = Router();

router.post("/", createReminder); // Create reminder
router.get("/", getReminders); // Get all reminders for user
router.get("/:id", getReminderById); // Get single reminder
router.put("/:id", updateReminder); // Update reminder
router.delete("/:id", deleteReminder); // Delete reminder

export default router;
