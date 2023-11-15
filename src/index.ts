import { createServer } from './infrastructure/config/app';
import connectDB from './infrastructure/config/db'
import dotenv from 'dotenv';
dotenv.config();
const app = createServer();
const port = process.env.PORT || 6000

connectDB().then(() =>{
  app?.listen(port, () => console.log(`Example app listening on port ${port}`));
});