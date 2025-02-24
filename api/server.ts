import express, { Application, Request, Response } from "express";
import cors from 'cors';
import dotenv from "dotenv";
import authRoutes from './auth/authRoutes';
import todoRoutes from './todo/todoRoutes';
import subtaskRouter from './subtask/subtaskRoutes';
import reminderRouter from './reminder/reminderRoutes';
import projectRouter from './project/project.routes';
import mongoose from "mongoose";

dotenv.config(); // Load environment variables

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://localhost:3000', '*'],
    allowedHeaders: ['Origin', 'X-Requested-with', 'Content-Type', 'Accept', 'Authorization', 'ngrok-skip-browser-warning']
}));

mongoose.connect(process.env.MONGO_URI as string);
mongoose.connection.on('error', (error) => console.error(`Error in MongoDb connection: ${error}`));
mongoose.connection.on('reconnected', () => console.log('Mongo reconnected successfully!'));
mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected!'));
mongoose.connection.on('connected', () => {
    console.log('Mongo DB Connected')
    app.set('etag', false);
    
    const jsonOptions = {
        limit: '100mb', // Limit the request body size
        strict: true, // Only parse arrays and objects (no primitives)
        type: 'application/json' // Expected content type
    };
    const urlencodedOptions = {
        extended: true, // Allows for parsing of nested objects
        limit: '100mb' // Limit the request body size
    };
    
    app.use(express.json(jsonOptions));
    app.use(express.urlencoded(urlencodedOptions));
    // app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    //     if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    //         res.send({ response: 'invalid JSON input' }); // Handling JSON parsing error
    //     } else {
    //         next(err); // Forwarding other errors to the next middleware
    //     }
    // });
});

// Sample Route
app.get("/", (req: Request, res: Response) => {
    res.send({ message: "Hello, TypeScript with Express!" });
});

app.use('/api/users', authRoutes)
app.use('/api/todos', todoRoutes)
app.use('/api/subtasks', subtaskRouter)
app.use('/api/reminders', reminderRouter)
app.use('/api/projects', projectRouter)

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
