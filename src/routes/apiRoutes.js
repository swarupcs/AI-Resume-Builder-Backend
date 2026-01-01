import express from "express";
import authRouter from "./auth.routes.js";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);

apiRouter.use("/ping", (req, res) => {
    res.json({ message: "pong", status: 200 });
})

export default apiRouter;