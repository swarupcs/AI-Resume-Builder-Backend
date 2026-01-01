import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import apiRouter from './routes/apiRoutes.js';

const app = express();
const PORT = process.env.PORT || 8080;

dotenv.config();

// Database connection
await connectDB();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Welcome to AI Resume Builder API');
});

app.use('/api', apiRouter);

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
