import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
const PORT = process.env.PORT || 8080;

dotenv.config();

console.log(process.env.MONGODB_URI);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});