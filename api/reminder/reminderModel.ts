import mongoose, { Schema } from "mongoose";

// Define Reminder Schema
const reminderSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", 
            // required: true 
        },
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        dateTime: { type: Date, required: true },
        repeat: { type: String, enum: ["none", "daily", "weekly", "monthly", "yearly"], default: "none" },
        status: { type: String, enum: ["pending", "completed", "missed"], default: "pending" },
        notificationSent: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Reminder = mongoose.model("Reminder", reminderSchema);
