import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

const app = express();
const PORT = process.env.PORT || 8080;

dotenv.config();


// Database connection
await connectDB()


app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to AI Resume Builder API")
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});