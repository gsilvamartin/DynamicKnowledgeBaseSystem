import { AppError } from '../../utils/AppError';

describe('AppError', () => {
    it('should create error with custom message and status code', () => {
        const error = new AppError('Custom error', 400);
        expect(error.message).toBe('Custom error');
        expect(error.statusCode).toBe(400);
        expect(error.name).toBe('AppError');
        expect(error instanceof Error).toBe(true);
    });

    it('should create error with default status code', () => {
        const error = new AppError('Custom error');
        expect(error.message).toBe('Custom error');
        expect(error.statusCode).toBe(500);
        expect(error.name).toBe('AppError');
    });
}); 