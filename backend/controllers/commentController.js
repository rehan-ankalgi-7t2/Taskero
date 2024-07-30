import path from 'path';
import {ObjectId} from 'bson';
import logger from '../utils/logger.js';
import { handleResponse } from '../utils/common.js';
import { Task } from '../models/taskModel.js';

const filename = path.basename(import.meta.url);
const loggerInstance = logger(filename);

/**
 * @description create new comment on the task
 * @method POST
 * @path /comment/create
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createNewComment = async (req, res) => {
    try {
        const commentData = req.body;
        const existingTask = await Task.findOne({_id: ObjectId(commentData.taskId)});
        if (!existingTask) {
            return res.status(409).send({ success: false, message: 'Task not found' });
        }
        const newComment = await Comment.create(commentData);
        existingTask.taskComments.push(existingTask._id);
        await existingTask.save();
        if (newComment) {
            return res.status(201).send(handleResponse('comment added successfully', true, 200));
        }
        return res.status(500).send(handleResponse(null, false, 500, 'failed to insert comment'));
    } catch (error) {
        loggerInstance.error(`Error in comment controller - createNewComment: ${error.message}`);
        return res.status(500).send(handleResponse(null, false, 500, error.message));
    }
}

export {
    createNewComment,
}