import { Request, Response, NextFunction } from 'express';
import { createRequestLogger } from '../utils/logger';

export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const logger = createRequestLogger(req);
    const start = Date.now();

    // Log request
    logger.info('Incoming request', {
        query: req.query,
        body: req.body,
        headers: {
            ...req.headers,
            authorization: req.headers.authorization ? '[REDACTED]' : undefined
        }
    });

    // Log response
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('Request completed', {
            statusCode: res.statusCode,
            duration,
            contentLength: res.get('content-length')
        });
    });

    next();
}; 