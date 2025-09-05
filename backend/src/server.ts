import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import postsRouter from './routes/posts';
import analyticsRouter from './routes/analytics';
import authRouter from './routes/auth';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mini_analytics';
const port = Number(process.env.PORT) || 4000;

async function connectDb(): Promise<void> {
    await mongoose.connect(mongoUri);
}

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);
app.use('/api/analytics', analyticsRouter);

// Global error handler
app.use(errorHandler);

connectDb()
    .then(() => {
        app.listen(port, () => {
            // eslint-disable-next-line no-console
            console.log(`Backend listening on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to connect to database', err);
        process.exit(1);
    });


