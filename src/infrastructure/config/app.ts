import express from 'express';
import cors from 'cors';
import userRoute from '../routes/userRoute'


export const createServer = () =>{
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use('/',userRoute);

  return app;
}