import winston from 'winston';
import { Request } from 'express';

const logLevel = process.env.LOG_LEVEL || 'info';

const format = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

const transports: winston.transport[] = [
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error'
    }),
    new winston.transports.File({
        filename: 'logs/combined.log'
    })
];

// Add console transport in non-production environments
if (process.env.NODE_ENV !== 'production') {
    transports.push(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    );
}

const logger = winston.createLogger({
    level: logLevel,
    format,
    transports
});

export interface LogContext {
    correlationId?: string;
    userId?: string;
    method?: string;
    path?: string;
    duration?: number;
    error?: Error;
    metadata?: Record<string, any>;
    query?: Record<string, any>;
    body?: Record<string, any>;
    headers?: Record<string, any>;
    statusCode?: number;
    contentLength?: string;
    version?: string;
    minVersion?: string;
    maxVersion?: string;
}

export const createRequestLogger = (req: Request) => {
    return {
        info: (message: string, context: LogContext = {}) => {
            logger.info(message, {
                ...context,
                correlationId: req.correlationId,
                method: req.method,
                path: req.path,
                userAgent: req.get('user-agent'),
                ip: req.ip
            });
        },
        error: (message: string, error: Error, context: LogContext = {}) => {
            logger.error(message, {
                ...context,
                correlationId: req.correlationId,
                method: req.method,
                path: req.path,
                error: {
                    message: error.message,
                    stack: error.stack,
                    name: error.name
                }
            });
        },
        warn: (message: string, context: LogContext = {}) => {
            logger.warn(message, {
                ...context,
                correlationId: req.correlationId,
                method: req.method,
                path: req.path
            });
        },
        debug: (message: string, context: LogContext = {}) => {
            logger.debug(message, {
                ...context,
                correlationId: req.correlationId,
                method: req.method,
                path: req.path
            });
        }
    };
};

export default logger; 