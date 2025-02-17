import { NextFunction, Request, Response } from "express";
import { Subtask } from "../todo/todoModel";
import handleResponse, { ResponseObject } from "../utils/handleResponse";
import { aggregateWithPagination } from "../utils/paginationHelper";
import mongoose from "mongoose";

const createSubtask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        
    } catch (error) {
        process.env.NODE_ENV === 'development' && console.log(error);
        res.status(500).json(handleResponse(null, false, 500, 'something went wrong'));
    }
}

const getAllSubtasksByTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string);
        const pageSize = parseInt(req.query.pageSize as string);
        const searchQuery = req.query.search;
        const { title } = req.query;
        const regexPattern = new RegExp(searchQuery as string, 'i');
        const query =
            searchQuery && searchQuery.length !== 0
                ? {
                    $or: [{ title: regexPattern }]
                }
                : {};

        const pipeline = [
            {
                $match: query
            }
        ]
        const data = await aggregateWithPagination(Subtask, pipeline, page, pageSize);

        if (data && data.data.length > 0) {
            res.status(200).send(handleResponse(data.data, true, 200, null, null, data.totalDocuments, data.totalPages, pageSize));
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
        const SubtaskUpdateBody = req.body;

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).json(handleResponse(null, false, 400, 'invalid Subtask id'));
        }

        await Subtask.findByIdAndDelete(req.params.id, SubtaskUpdateBody);

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