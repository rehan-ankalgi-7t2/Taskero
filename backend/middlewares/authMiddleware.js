import jwt from 'jsonwebtoken';
import path from 'path';
import { readFile } from 'fs/promises';
import logger from '../utils/logger.js';
import { handleResponse } from '../utils/common.js';

const privateKey = await readFile('privateKey.key', 'utf8');
const filename = path.basename(import.meta.url);
const loggerInstance = logger(filename);

// verifying the token (authorization check)
function verifyToken() {
    return async (req, res, next) => {
        try {
            let token;
            if (req.headers.authorization && req.headers.authorization !== '' && req.headers.authorization !== null) {
                token = req.headers.authorization;
                token = token.substring(7);
            }
            if (!token) {
                return res.status(401).send(handleResponse(null, false, 401, 'Unauthorized access'));
            }

            const verifyAccessToken = jwt.verify(token, privateKey, { algorithms: ['RS256'] });
            if (!verifyAccessToken) {
                return res.status(401).send(handleResponse(null, false, 401, 'Unauthorized access'));
            }
            next();
        } catch (error) {
            loggerInstance.error(`Error in verifying token: ${error.message}`);
            // eslint-disable-next-line no-console
            console.error('Error checking access:', error);
            return res.status(401).send(handleResponse(null, false, 401, error.message));
        }
    };
}

export {
    verifyToken
}