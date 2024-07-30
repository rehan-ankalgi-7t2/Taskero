import jwt from 'jsonwebtoken';
import path from 'path';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const privateKey = await readFile('privateKey.key', 'utf8');
const publicKey = await readFile('publicKey.key', 'utf8');

const handleResponse = (
    data = null,
    isSuccess = false,
    statusCode = 500,
    errorMessage = null,
    warningMessage = null,
    totalRecords = null,
    totalPages = null,
    recordsPerPage = null
) => ({
    data,
    isSuccess,
    statusCode,
    warningMessage,
    errorMessage,
    totalRecords,
    totalPages,
    recordsPerPage
});

// eslint-disable-next-line default-param-last
const pagination = async (model, query = {}, page, pageSize, sortOption = null, selectionQuery = { updatedAt: 0 }) => {
    try {
        const sortObject = {};
        if (sortOption && sortOption.field && sortOption.order) {
            sortObject[sortOption.field] = sortOption.order === 'desc' ? -1 : 1;
        }
        if (page) {
            const skip = (page - 1) * pageSize;
            const totalDocuments = await model.countDocuments(query);
            const totalPages = Math.ceil(totalDocuments / pageSize);

            const documents = await model.find(query, selectionQuery).sort(sortObject).skip(skip).limit(pageSize);

            return {
                success: true,
                data: documents,
                page,
                pageSize,
                totalPages,
                totalDocuments
            };
        } 
            const documents = await model.find(query, selectionQuery).sort(sortObject);
            return {
                success: true,
                data: documents,
                totalDocuments: documents.length
            };
        
    } catch (error) {
        return false;
    }
};

const aggregateWithPagination = async (model, pipeline, page, pageSize) => {
    try {
        if (!page) {
            const results = await model.aggregate(pipeline);
            return {
                success: true,
                data: results,
                totalDocuments: results.length
            };
        }

        const totalCount = await model.aggregate([...pipeline, { $count: 'totalCount' }]);
        const totalDocuments = totalCount.length > 0 ? totalCount[0].totalCount : 0;

        const paginatedPipeline = [...pipeline, { $skip: (page - 1) * pageSize }, { $limit: pageSize }];

        const results = await model.aggregate(paginatedPipeline);

        return {
            success: true,
            data: results,
            totalPages: Math.ceil(totalDocuments / pageSize),
            page,
            pageSize,
            totalDocuments
        };
    } catch (error) {
        return false;
    }
};

// Function to generate access token
const generateAccessToken = (data) => jwt.sign(data, privateKey, { algorithm: 'RS256', expiresIn: '1d' });

// Function to generate refresh token
const generateRefreshToken = (data) => jwt.sign(data, publicKey, { algorithm: 'RS256', expiresIn: '30d' });

export {
    handleResponse,
    pagination,
    generateAccessToken,
    generateRefreshToken,
    aggregateWithPagination,
    __dirname
};