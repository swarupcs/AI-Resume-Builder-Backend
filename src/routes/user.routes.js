import express from 'express';

import { getUserById } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

userRouter.use(authMiddleware);

userRouter.get('/profile', getUserById);

export default userRouter;