import { Request, Response } from "express";
import Reminder from "./reminderModel";

// 📌 1️⃣ Create a Reminder
export const createReminder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, dateTime, repeat } = req.body;
        const userId = (req as any).user._id; // Assuming authentication middleware sets `req.user`

        const reminder = new Reminder({
            user: userId,
            title,
            description,
            dateTime,
            repeat,
        });

        await reminder.save();
        res.status(201).json({ message: "Reminder created successfully", reminder });
    } catch (error) {
        res.status(500).json({ error: "Failed to create reminder" });
    }
};

// 📌 2️⃣ Get All Reminders for a User
export const getUserReminders = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user._id;
        const reminders = await Reminder.find({ user: userId }).sort({ dateTime: 1 });

        res.status(200).json(reminders);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reminders" });
    }
};

// 📌 3️⃣ Get a Single Reminder by ID
export const getReminderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const reminder = await Reminder.findById(id);

        if (!reminder) {
            res.status(404).json({ error: "Reminder not found" });
            return;
        }

        res.status(200).json(reminder);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reminder" });
    }
};

// 📌 4️⃣ Update a Reminder
export const updateReminder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const reminder = await Reminder.findByIdAndUpdate(id, updateData, { new: true });

        if (!reminder) {
            res.status(404).json({ error: "Reminder not found" });
            return;
        }

        res.status(200).json({ message: "Reminder updated successfully", reminder });
    } catch (error) {
        res.status(500).json({ error: "Failed to update reminder" });
    }
};

// 📌 5️⃣ Delete a Reminder
export const deleteReminder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const reminder = await Reminder.findByIdAndDelete(id);

        if (!reminder) {
            res.status(404).json({ error: "Reminder not found" });
            return;
        }

        res.status(200).json({ message: "Reminder deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete reminder" });
    }
};
