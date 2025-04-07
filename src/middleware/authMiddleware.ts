import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../interfaces/IUser';
import { UserService } from '../services/UserService';
import { AppError } from '../utils/AppError';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: UserRole;
            };
        }
    }
}

export const authenticate = (userService: UserService) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.header('user-id');
            if (!userId) {
                throw new AppError('User ID is required', 401);
            }

            const user = await userService.getById(userId);
            if (!user) {
                throw new AppError('User not found', 401);
            }

            req.user = {
                id: user.id,
                role: user.role
            };

            next();
        } catch (error) {
            next(error);
        }
    };
};

export const authorize = (roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw new AppError('User not authenticated', 401);
            }

            if (!roles.includes(req.user.role)) {
                throw new AppError('Insufficient permissions', 403);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}; 