import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createResume } from "../controllers/resume.controller.js";

const resumeRouter = express.Router();

resumeRouter.use(authMiddleware);

resumeRouter.post('/create', createResume);



export default resumeRouter;
