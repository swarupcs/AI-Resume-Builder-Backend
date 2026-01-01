import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createResume, getPublicResumeById, getResumeById, updateResume } from "../controllers/resume.controller.js";
import upload from "../config/multer.js";

const resumeRouter = express.Router();

resumeRouter.use(authMiddleware);

resumeRouter.post('/create', createResume);
resumeRouter.patch('/update', upload.single('image'), updateResume);
resumeRouter.get('/:resumeId', getResumeById);
resumeRouter.get('/public/:resumeId', getPublicResumeById);




export default resumeRouter;
