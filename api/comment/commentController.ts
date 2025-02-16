import { NextFunction, Request, Response } from "express";
import { Comment } from "./commentModel";
import handleResponse, { ResponseObject } from "../utils/handleResponse";
import { aggregateWithPagination } from "../utils/paginationHelper";
import mongoose from "mongoose";

const createComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const commentBody = req.body;

        const newComment = await Comment.create(commentBody);

        if (newComment) {
            res.status(201).json(handleResponse(newComment, true, 201));
        } else {
            res.status(409).json(handleResponse(null, false, 409, 'something went wrong while creating comment'));
        }
    } catch (error) {
        process.env.NODE_ENV === 'development' && console.log(error);
        res.status(500).json(handleResponse(null, false, 500, 'something went wrong'));
    }
}

const getAllCommentsByTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string);
        const pageSize = parseInt(req.query.pageSize as string);
        const query = {
            todoId: ''
        }
        const todoId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(todoId)) {
            res.status(400).json(handleResponse(null, false, 400, 'invalid todo id'));
        }
        if(todoId) query.todoId = todoId;
        const pipeline = [
            {
                $match: query
            }
        ]
        const data = await aggregateWithPagination(Comment, pipeline, page, pageSize);

        if (data && data.data.length > 0) {
            res.status(200).send(handleResponse(data.data, true, 200, null, null, data.totalDocuments, data.totalPages, pageSize));
        } else {
            res.status(404).send(handleResponse('', false, 500, 'comments not found'));
        }
    } catch (error) {
        process.env.NODE_ENV === 'development' && console.log(error);
        res.status(500).json(handleResponse(null, false, 500, 'something went wrong'));
    }
}

const getCommentDetails = async (req: Request, res: Response) => {
    try {
        const commentId = req.params.id;
        process.env.NODE_ENV === 'development' && console.log(JSON.stringify(req.params.id))
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            res.status(400).json(handleResponse(null, false, 400, 'invalid comment id'));
        }

        const data = await Comment.findById(commentId);

        if (data) {
            res.status(200).send(handleResponse(data, true, 200));
        } else {
            res.status(404).send(handleResponse('', false, 500, 'comment not found'));
        }
    } catch (error) {
        process.env.NODE_ENV === 'development' && console.log(error);
        res.status(500).json(handleResponse(null, false, 500, 'something went wrong'));
    }
}

const updateComment = async (req: Request, res: Response) => {
    try {
        const commentUpdateBody = req.body;
        const commentId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            res.status(400).json(handleResponse(null, false, 400, 'invalid comment id'));
        }

        const updatedComment = await Comment.findByIdAndUpdate(req.params.id, commentUpdateBody, { new: true });

        if (updatedComment) {
            res.status(201).json(handleResponse(updatedComment, true, 200));
        } else {
            res.status(409).json(handleResponse(null, false, 409, 'something went wrong while updating comment'));
        }
    } catch (error) {
        process.env.NODE_ENV === 'development' && console.log(error);
        res.status(500).json(handleResponse(null, false, 500, 'something went wrong'));
    }
}

const deleteComment = async (req: Request, res: Response) => {
    try {
        const commentId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            res.status(400).json(handleResponse(null, false, 400, 'invalid comment id'));
        }

        await Comment.findByIdAndDelete(commentId);

        const deletedComment = await Comment.findById(commentId);

        if (deletedComment) {
            res.status(409).json(handleResponse(null, false, 409, 'something went wrong while deleting comment'));
        } else {
            res.status(201).json(handleResponse('comment deleted successfully', true, 200));
        }
    } catch (error) {
        process.env.NODE_ENV === 'development' && console.log(error);
        res.status(500).json(handleResponse(null, false, 500, 'something went wrong'));
    }
}

export { createComment, getAllCommentsByTodo, getCommentDetails, updateComment, deleteComment };