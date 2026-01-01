import express from "express";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";

const apiRouter = express.Router();

apiRouter.use('/ping', (req, res) => {
  res.json({ message: 'pong', status: 200 });
});

apiRouter.use("/auth", authRouter);

apiRouter.use("/user", userRouter);



export default apiRouter;