import { NextFunction, Request, Response } from "express";
import { Subtask } from "../todo/todoModel";
import handleResponse, { ResponseObject } from "../utils/handleResponse";
import { aggregateWithPagination } from "../utils/paginationHelper";
import mongoose from "mongoose";

const createSubtask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const subtaskBody = req.body;

        if(!mongoose.Types.ObjectId.isValid(subtaskBody.todoId.toString())){
            res.status(400).send(handleResponse('', false, 400, 'Invalid Todo Id'));
        }

        const createdSubtask = await Subtask.create(subtaskBody);

        if (createdSubtask) {
            res.status(200).send(handleResponse(createdSubtask, true, 200));
        } else {
            res.status(409).send(handleResponse('', false, 409, 'Something went wrong while creating subtask'));
        }
    } catch (error) {
        process.env.NODE_ENV === 'development' && console.log(error);
        res.status(500).json(handleResponse(null, false, 500, 'something went wrong'));
    }
}

const getAllSubtasksByTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const todoId = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(todoId.toString())){
            res.status(400).send(handleResponse('', false, 400, 'Invalid Todo Id'));
        }
        
        const data = await Subtask.find({todoId});

        if (data) {
            res.status(200).send(handleResponse(data, true, 200));
        } else {
            res.status(404).send(handleResponse('', false, 500, 'Subtasks not found'));
        }
    } catch (error) {
        process.env.NODE_ENV === 'development' && console.log(error);
        res.status(500).json(handleResponse(null, false, 500, 'something went wrong'));
    }
}

const updateSubtask = async (req: Request, res: Response) => {
    try {
        const SubtaskUpdateBody = req.body;

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).json(handleResponse(null, false, 400, 'invalid Subtask id'));
        }

        const updatedSubtask = await Subtask.findByIdAndUpdate(req.params.id, SubtaskUpdateBody, { new: true });

        if (updatedSubtask) {
            res.status(201).json(handleResponse(updatedSubtask, true, 200));
        } else {
            res.status(409).json(handleResponse(null, false, 409, 'something went wrong while updating Subtask'));
        }
    } catch (error) {
        process.env.NODE_ENV === 'development' && console.log(error);
        res.status(500).json(handleResponse(null, false, 500, 'something went wrong'));
    }
}

const deleteSubtask = async (req: Request, res: Response) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).json(handleResponse(null, false, 400, 'invalid Subtask id'));
        }

        await Subtask.findByIdAndDelete(req.params.id);

        const deletedSubtask = await Subtask.findById(req.params.id);

        if (deletedSubtask) {
            res.status(409).json(handleResponse(null, false, 409, 'something went wrong while updating Subtask'));
        } else {
            res.status(201).json(handleResponse('Subtask deleted successfully', true, 200));
        }
    } catch (error) {
        process.env.NODE_ENV === 'development' && console.log(error);
        res.status(500).json(handleResponse(null, false, 500, 'something went wrong'));
    }
}

export { createSubtask, getAllSubtasksByTodo, updateSubtask, deleteSubtask };