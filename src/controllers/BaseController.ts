import { Request, Response } from 'express';
import { AppError } from '../utils/AppError';

export abstract class BaseController {
    protected sendResponse<T>(res: Response, data: T, statusCode: number = 200): void {
        res.status(statusCode).json({
            success: true,
            data
        });
    }

    protected sendError(res: Response, error: Error | AppError): void {
        const statusCode = error instanceof AppError ? error.statusCode : 500;
        const message = error instanceof AppError ? error.message : 'Internal server error';

        res.status(statusCode).json({
            success: false,
            error: message
        });
    }

    protected handleAsyncError(fn: Function) {
        return async (req: Request, res: Response) => {
            try {
                await fn(req, res);
            } catch (error) {
                this.sendError(res, error as Error);
            }
        };
    }
} 