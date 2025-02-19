import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ActivitySchema = new Schema(
    {
        action: {
            type: String,
            enum: [
                "Project Created",
                "Task Added",
                "Task Updated",
                "Task Completed",
                "User Assigned",
                "Status Changed",
                "Priority Updated",
            ],
            required: true,
        },
        performedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        details: {
            type: String, // Example: "Changed status from Pending to In Progress"
        },
    },
    { _id: false } // Prevents creating an extra ObjectId for each activity entry
);

const ProjectSchema = new Schema(
    {
        tintColor: {
            type: String,
            default: '#ffffff'
        },
        title: {
            type: String,
            required: [true, "Project title is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        assignedUsers: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        tasks: [
            {
                type: Schema.Types.ObjectId,
                ref: "Todo",
            },
        ],
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Completed"],
            default: "Pending",
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium",
        },
        dueDate: {
            type: Date,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        activities: [ActivitySchema], // Embedding activity logs
    },
    { timestamps: true } // Auto-adds createdAt & updatedAt
);

const Project = model("Project", ProjectSchema);
export default Project;
