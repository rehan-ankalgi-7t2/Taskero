import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import handleResponse, { ResponseObject } from "../utils/handleResponse";

export const validateRequest = (schema: any) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessage = error.errors.map(err => `${err.path.join(".")}: ${err.message}`).join(", ");
                res.status(400).json(handleResponse(null, false, 400, errorMessage));
            } else {
                res.status(500).json(handleResponse(null, false, 500, "Internal Server Error"));
            }
        }
    };
};