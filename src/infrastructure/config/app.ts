import express from 'express';
import cors from 'cors';
import userRoute from '../routes/userRoute'
import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
dotenv.config();


export const createServer = () =>{
  try{
    const app = express();
    app.use((req,res,next) => {
      res.setHeader('Access-Control-Allow-Origin',process.env.CLIENT_URL || '');
      res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers','X-Requested-With,Content-Type,Authorization')
      next();
    })
    app.use(express.json({limit:'10mb'}));
    app.use(express.urlencoded({extended:true}));
    app.use(express.static(path.join(__dirname,'../public')))
    app.use(cookieParser());
  
    app.use(cors());
    app.use('/api/user',userRoute);
    app.use((req,res) => res.status(404).json({success:false,message:'Not Found'}));
  
    return app;
  }catch(error){
    const err:Error = error as Error;
    console.log(err.message);
  }
}