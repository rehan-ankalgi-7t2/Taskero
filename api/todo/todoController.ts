import { NextFunction, Request, Response } from "express";
import { Subtask, Todo } from "./todoModel";
import handleResponse, { ResponseObject } from "../utils/handleResponse";
import { aggregateWithPagination } from "../utils/paginationHelper";
import mongoose from "mongoose";

const createTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const todoBody = req.body;
        let newTodoObj = new Todo({
            title: todoBody.title,
        })

        if(todoBody.description) newTodoObj.description = todoBody.description;
        if(todoBody.deadline) newTodoObj.deadline = todoBody.deadline;

        const createdTodo = await newTodoObj.save();

        if(createdTodo){
            if(todoBody.subtasks){
                const subtasksBody = todoBody.subtasks.map((subtask: {subtaskTitle: string}) => ({
                    subtaskTitle: subtask?.subtaskTitle,
                    todoId: createdTodo._id
                }))

                const createdSubTasks = await Subtask.insertMany(subtasksBody);

                if (!createdSubTasks){
                    res.status(409).json(handleResponse(null, false, 409, 'something went wrong while inserting subtasks'));
                }
            }
            res.status(201).json(handleResponse(createdTodo, true, 201));
        } else {
            res.status(409).json(handleResponse(null, false, 409, 'something went wrong while creating todo'));
        }
    } catch (error) {
        process.env.NODE_ENV === 'development' && console.log(`TODO :: createTodo :: ${error}`);
        res.status(500).send(handleResponse('', false, 500, 'Something went wrong'));
    }
}

const getAllTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        const data = await aggregateWithPagination(Todo, pipeline, page, pageSize);

        if(data && data.data.length > 0){
            res.status(200).send(handleResponse(data.data, true, 200, null, null, data.totalDocuments, data.totalPages, pageSize));
        } else {
            res.status(404).send(handleResponse('', false, 500, 'todos not found'));
        }
    } catch (error) {
        process.env.NODE_ENV === 'development' && console.log(`TODO :: getAllTodo :: ${error}`);
        res.status(500).send(handleResponse('', false, 500, 'Something went wrong'));
    }
}

const getTodoDetails = async (req: Request, res: Response) => {
    try {
        const todoId = req.params.id;
        // process.env.NODE_ENV === 'development' && console.log(JSON.stringify(req.params.id))
        if(!mongoose.Types.ObjectId.isValid(todoId)){
            res.status(400).json(handleResponse(null, false, 400, 'invalid todo id'));
        }

        const data = await Todo.findById(todoId);

        if(data){
            res.status(200).send(handleResponse(data, true, 200));
        } else {
            res.status(404).send(handleResponse('', false, 500, 'todos not found'));
        }
    } catch (error) {
        process.env.NODE_ENV === 'development' && console.log(`TODO :: getTodoDetails :: ${error}`);
        res.status(500).send(handleResponse('', false, 500, 'Something went wrong'));
    }
}

const updateTodo = async (req: Request, res: Response) => {
    try {
        const todoUpdateBody = req.body;

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).json(handleResponse(null, false, 400, 'invalid todo id'));
        }

        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, todoUpdateBody, {new: true});

        if (updatedTodo) {
            res.status(201).json(handleResponse(updatedTodo, true, 200));
        } else {
            res.status(409).json(handleResponse(null, false, 409, 'something went wrong while updating todo'));
        }
    } catch (error) {
        process.env.NODE_ENV === 'development' && console.log(`TODO :: updateTodo :: ${error}`);
        res.status(500).send(handleResponse('', false, 500, 'Something went wrong'));
    }
}

const deleteTodo = async (req: Request, res: Response) => {
    try {
        const todoUpdateBody = req.body;

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).json(handleResponse(null, false, 400, 'invalid todo id'));
        }

        await Todo.findByIdAndDelete(req.params.id, todoUpdateBody);

        const deletedTodo = await Todo.findById(req.params.id);

        if (deletedTodo) {
            res.status(409).json(handleResponse(null, false, 409, 'something went wrong while updating todo'));
        } else {
            res.status(201).json(handleResponse('todo deleted successfully', true, 200));
        }
    } catch (error) {
        process.env.NODE_ENV === 'development' && console.log(`TODO :: deleteTodo :: ${error}`);
        res.status(500).send(handleResponse('', false, 500, 'Something went wrong'));
    }
}

export { createTodo, getAllTodo, getTodoDetails, updateTodo, deleteTodo};