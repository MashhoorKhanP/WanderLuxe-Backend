import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import connectDB from './infrastructure/config/db'
import { createServer } from './infrastructure/config/app';
const port = process.env.PORT || 5000

const app = createServer();
connectDB()


app.get('/', (req, res) => {
  res.send('Hello Worlddfsfadsf!')
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})