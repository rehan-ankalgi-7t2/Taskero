import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

const sessionSchema = new mongoose.Schema(
    {
        ID: {
            type: ObjectId,
            required: true
        },
        refreshToken: {
            type: String,
            required: true
        },
        accessToken: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            expires: 86400, // TTL in seconds (1 day)
            default: Date.now
        }
    },
    { timestamps: true, versionKey: false }
);

// eslint-disable-next-line import/prefer-default-export
export const Session = mongoose.model('Session', sessionSchema);