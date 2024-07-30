/* eslint-disable no-console */
/** Dependency Injection */
import express from 'express';
import cors from 'cors';
import http from 'http';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import CONFIG from './config/config.js';
import appRoutes from './routes/appRoutes.js';

const app = express();
const server = http.createServer(app);

app.use(
    cors({
        credentials: true,
        origin: [
            'http://localhost:3000',
            '*'
        ],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        // allowedHeaders: ['Origin', 'X-Requested-with', 'Content-Type', 'Accept', 'Authorization']
        allowedHeaders: ['Origin', 'X-Requested-with', 'Content-Type', 'Accept', 'Authorization', 'ngrok-skip-browser-warning']
    })
);

// Use Helmet middleware with specific options
app.use(
    helmet({
        contentSecurityPolicy: false, // Disabling contentSecurityPolicy
        xDownloadOptions: false
    })
);

/** MongoDB Connection */
const options = {
    connectTimeoutMS: 30000
};

mongoose.connect(CONFIG.DB_URL, options);
mongoose.connection.on('error', (error) => console.error(`Error in MongoDb connection: ${error}`));
mongoose.connection.on('reconnected', () => console.log('Mongo reconnected successfully!'));
mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected!'));
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected')

    /** Middleware Configuration */
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
    // app.use(paginateResults);
    app.use((err, req, res, next) => {
        if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
            res.send({ response: 'invalid JSON input' }); // Handling JSON parsing error
        } else {
            next(err); // Forwarding other errors to the next middleware
        }
    });

    const accessLogStream = fs.createWriteStream(path.join(dirname(fileURLToPath(import.meta.url)), 'access.log'), { flags: 'a' });

    // setup logger
    app.use(
        morgan(
            (tokens, req, res) => {
                // console.log(tokens);
                const method = tokens.method(req, res);
                const url = tokens.url(req, res);
                const status = tokens.status(req, res);
                const contentLength = tokens.res(req, res, 'content-length');
                const responseTime = tokens['response-time'](req, res);
                const date = new Date().toJSON();

                let logData = [method, url, status, contentLength, '-', `${responseTime}ms`, date];

                // Add request body for POST, PATCH, PUT requests
                if (method === 'POST' || method === 'PATCH' || method === 'PUT') {
                    logData.splice(5, 0, JSON.stringify(req.body));
                }

                // Add additional tokens
                if (tokens[':rest']) {
                    logData = logData.concat(tokens[':rest'](req, res) || []);
                }
            },
            { stream: accessLogStream }
        )
    );

    // API routes
    app.use('/api/', appRoutes);
    /** HTTP Server Instance */
    try {
        if (server.listening === false) {
            server.listen(CONFIG.PORT, () => {
                console.log('Server turned on with', CONFIG.ENV, 'mode on port', CONFIG.PORT);
            });
        }
    } catch (ex) {
        console.log('TCL: ex', ex);
    }
    /** /HTTP Server Instance */
});