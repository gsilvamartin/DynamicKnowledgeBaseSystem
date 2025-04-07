import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../utils/AppError';

declare global {
    namespace Express {
        interface Request {
            correlationId: string;
        }
    }
}

export const correlationIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Get correlation ID from header or generate a new one
    const correlationId = req.headers['x-correlation-id'] as string || uuidv4();
    
    // Add correlation ID to request object
    req.correlationId = correlationId;
    
    // Add correlation ID to response headers
    res.setHeader('x-correlation-id', correlationId);
    
    next();
}; 