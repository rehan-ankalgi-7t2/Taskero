import { Request, Response } from "express";
import {Reminder} from "./reminderModel";
import handleResponse from "../utils/handleResponse";
import mongoose from "mongoose";

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
        process.env.NODE_ENV === 'development' && console.log(`REMINDER :: createReminder :: ${error}`);
        res.status(500).send(handleResponse('', false, 500, 'Something went wrong'));
    }
};

/**
 * @description:
 * -> getReminder endpoint recieves a userId (compulsorily) and a dateTime param which is defaultly set to current day. the reminders for that particular user and falling on that day to be fetched
 * @param req 
 * @param res 
 */
export const getReminders = async (req: Request, res: Response): Promise<void> => {
    try {
        
    } catch (error) {
        process.env.NODE_ENV === 'development' && console.log(`REMINDER :: getReminder :: ${error}`);
        res.status(500).send(handleResponse('', false, 500, 'Something went wrong'));
    }
};

export const getReminderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            res.status(400).json(handleResponse(null, false, 400, 'invalid reminder id'));
        }
        const reminder = await Reminder.findById(id);

        if (!reminder) {
            res.status(404).json(handleResponse(null, false, 404, 'reminder not found'));
            return;
        }
        res.status(200).json(handleResponse(reminder, true, 200));
    } catch (error) {
        process.env.NODE_ENV === 'development' && console.log(`REMINDER :: getReminderById :: ${error}`);
        res.status(500).send(handleResponse('', false, 500, 'Something went wrong'));
    }
};

export const updateReminder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json(handleResponse(null, false, 400, 'invalid reminder id'));
        }

        const updatedReminder = await Reminder.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedReminder) {
            res.status(400).json(handleResponse(null, false, 400, 'something went wrong while updating reminder'));
            return;
        }

        res.status(200).json(handleResponse(updatedReminder, true, 200));
    } catch (error) {
        process.env.NODE_ENV === 'development' && console.log(`REMINDER :: updateReminder :: ${error}`);
        res.status(500).send(handleResponse('', false, 500, 'Something went wrong'));
    }
};

export const deleteReminder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json(handleResponse(null, false, 400, 'invalid reminder id'));
        }

        await Reminder.findByIdAndDelete(id);
        const deletedReminder = await Reminder.findById(id);

        if (deletedReminder) {
            res.status(400).json(handleResponse(null, false, 400, 'something went wrong while deleting reminder'));
            return;
        }

        res.status(200).json(handleResponse('reminder deleted successfully', true, 200));
    } catch (error) {
        process.env.NODE_ENV === 'development' && console.log(`REMINDER :: deleteReminder :: ${error}`);
        res.status(500).send(handleResponse('', false, 500, 'Something went wrong'));
    }
};
