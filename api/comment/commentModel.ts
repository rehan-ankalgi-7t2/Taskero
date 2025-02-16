import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    todoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo',
        required: true
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    mentions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }]
}, {timestamps: true})

export const Comment = mongoose.model('Comment', commentSchema);