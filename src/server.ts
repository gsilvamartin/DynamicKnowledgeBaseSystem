import { app } from './app';
import logger from './utils/logger';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error: Error) => {
    logger.error('Unhandled Promise Rejection:', error);
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error);
    server.close(() => {
        process.exit(1);
    });
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
}); 