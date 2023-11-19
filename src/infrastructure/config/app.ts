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
    app.use(cookieParser());

    app.use(cors({
      origin: process.env.CLIENT_URL || '', // Allow requests from CLIENT_URL
      methods: 'GET, POST, PUT, DELETE, OPTIONS',
      allowedHeaders: 'X-Requested-With, Content-Type, Authorization',
      credentials:true
    }));
    app.options('*', cors());

    app.use(express.json({limit:'10mb'}));
    app.use(express.urlencoded({extended:true}));
    app.use(express.static(path.join(__dirname,'../public')))
    
    app.use('/api/user',userRoute);
    
    // // Handle 404 Not Found
    app.use((req,res) => res.status(404).json({success:false,message:'Not Found'}));
  
    return app;
  }catch(error){
    const err:Error = error as Error;
    console.log(err.message);
  }
}