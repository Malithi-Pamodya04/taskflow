import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
app.set('trust proxy', 1);

app.use(helmet());                                   // secure HTTP headers
app.use(cors({ origin: process.env.CLIENT_URL }));   // only our frontend may call the API
app.use(express.json({ limit: '10kb' }));            // parse JSON bodies, limit size
app.use(morgan('dev'));                              // request logging

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Central error handler (must have 4 params)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.status ? err.message : 'Internal server error',
  });
});

export default app;