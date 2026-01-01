import express from 'express';

import { getUserById, getUserResumes } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

userRouter.use(authMiddleware);

userRouter.get('/profile', getUserById);
userRouter.get('/resumes', getUserResumes);

export default userRouter;