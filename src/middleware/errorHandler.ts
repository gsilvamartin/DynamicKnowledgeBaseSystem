import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { createRequestLogger } from '../utils/logger';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const logger = createRequestLogger(req);

    if (err instanceof AppError) {
        logger.error('Application error occurred', err, {
            statusCode: err.statusCode
        });

        return res.status(err.statusCode).json({
            error: err.message,
            correlationId: req.correlationId
        });
    }

    // Handle unexpected errors
    logger.error('Unexpected error occurred', err);
    
    return res.status(500).json({
        error: 'Internal server error',
        correlationId: req.correlationId
    });
}; 