import mongoose from "mongoose";

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI as string);

    mongoose.connection.on('error', (error) => console.error(`Error in MongoDb connection: ${error}`));
    mongoose.connection.on('reconnected', () => console.log('Mongo reconnected successfully!'));
    mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected!'));
    mongoose.connection.on('connected', () => console.log('Mongo DB Connected'));
};

export default connectDB;