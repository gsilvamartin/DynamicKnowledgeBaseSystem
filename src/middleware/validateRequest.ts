import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from '../utils/AppError';

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const messages = errors.array().map(error => error.msg);
        throw new AppError(messages.join(', '), 400);
    }
    next();
}; 