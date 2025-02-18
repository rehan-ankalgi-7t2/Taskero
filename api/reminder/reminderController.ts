import { Request, Response } from "express";
import {Reminder} from "./reminderModel";
import handleResponse from "../utils/handleResponse";

export const createReminder = async (req: Request, res: Response): Promise<void> => {
    try {
        const reminderBody = req.body;
        // const userId = (req as any).user._id; // Assuming authentication middleware sets `req.user`

        const reminder = new Reminder({
            title: reminderBody.title,
            description: reminderBody.description,
            dateTime: reminderBody.description,
        });

        if(reminderBody.repeat){
            reminder.repeat = reminderBody.repeat
        }

        const createdReminder = await reminder.save();

        if (createdReminder) {
            res.status(200).send(handleResponse(createdReminder, true, 200));
        } else {
            res.status(409).send(handleResponse('', false, 409, 'Something went wrong while creating reminder'));
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to create reminder" });
    }
};

export const getUserReminders = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user._id;
        const reminders = await Reminder.find({ user: userId }).sort({ dateTime: 1 });

        res.status(200).json(reminders);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reminders" });
    }
};

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
