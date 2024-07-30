import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
        },
        password: {
            type: String,
        }
    },
    { timestamps: true, versionKey: false }
);

// eslint-disable-next-line import/prefer-default-export
export const User = mongoose.model('User', userSchema);