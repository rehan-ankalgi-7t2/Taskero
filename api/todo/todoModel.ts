import mongoose from 'mongoose';

const subtaskSchema = new mongoose.Schema({
    subtaskTitle: {
        type: String
    },
    isCompleted: {
        type: Number,
        default: 0
    }
}, {timestamps: true})

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        trim: true,
    },
    description: {
        type: String,
        require: true,
        trim: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ['todo', 'in-progress', 'completed', 'drop', 'hold'],
        default: 'todo'
    },
    deadline: {
        type: Date,   
    },
}, {timestamps: true});

// Cascade Delete Subtasks & Comments When Deleting a Todo
todoSchema.pre("findOneAndDelete", async function (next) {
    const todo = await this.model.findOne(this.getQuery());
    if (todo) {
        await mongoose.model("Subtask").deleteMany({ _id: { $in: todo.subtasks } });
    }
    next();
});

export const Subtask = mongoose.model("Subtask", subtaskSchema);
export const Todo = mongoose.model('Todo', todoSchema);