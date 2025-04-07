import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import logger from './utils/logger';
import { requestLoggerMiddleware } from './middleware/requestLogger';
import { correlationIdMiddleware } from './middleware/correlationId';
import { errorHandler } from './middleware/errorHandler';
import { topicRoutes } from './routes/topicRoutes';
import { resourceRoutes } from './routes/resourceRoutes';
import { userRoutes } from './routes/userRoutes';
import { swaggerSpec } from './config/swagger';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Correlation ID
app.use(correlationIdMiddleware);

// Logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(requestLoggerMiddleware);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Dynamic Knowledge Base System API Documentation"
}));

// Routes
app.use('/api/topics', topicRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        correlationId: req.correlationId
    });
});

// Error handler
app.use(errorHandler);

export { app }; 