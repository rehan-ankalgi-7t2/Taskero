import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: [true, 'taskName field is required']
    },
    taskDescription: {
        type: String,
    },
    taskType: {
        type: String,
        required: [true, 'taskName field is required'],
        enum: []
    },
    subtasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task'
        }
    ],
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    taskActivities: [
        {
            type: Object
        }
    ],
    taskStage: {
        type: String
    },
    taskComments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
}, {timestamps: true, versionKey: false});

export const Task = mongoose.model('Task', taskSchema);