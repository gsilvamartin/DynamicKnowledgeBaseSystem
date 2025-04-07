import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import { requestLoggerMiddleware } from './middleware/requestLogger';
import { topicRoutes } from './routes/topicRoutes';
import { resourceRoutes } from './routes/resourceRoutes';
import { userRoutes } from './routes/userRoutes';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLoggerMiddleware);

// Routes
app.use('/api/topics', topicRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/users', userRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 