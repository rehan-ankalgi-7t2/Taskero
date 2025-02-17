import mongoose, { Schema, Document } from "mongoose";

// Define Reminder Interface
export interface IReminder extends Document {
    user: mongoose.Schema.Types.ObjectId;
    title: string;
    description?: string;
    dateTime: Date;
    repeat: "none" | "daily" | "weekly" | "monthly" | "yearly";
    status: "pending" | "completed" | "missed";
    notificationSent: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define Reminder Schema
const ReminderSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        dateTime: { type: Date, required: true },
        repeat: { type: String, enum: ["none", "daily", "weekly", "monthly", "yearly"], default: "none" },
        status: { type: String, enum: ["pending", "completed", "missed"], default: "pending" },
        notificationSent: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model<IReminder>("Reminder", ReminderSchema);
