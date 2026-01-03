import express from 'express';
import { loginUser, signupUser } from '../controllers/auth.controller.js';


const authRouter = express.Router();

authRouter.post('/signup', signupUser);
authRouter.post('/signin', loginUser);

export default authRouter;
