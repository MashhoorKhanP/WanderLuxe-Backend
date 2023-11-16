import jwt,{JwtPayload} from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import UserRepository from '../repositories/userRepository';



declare global{
  namespace Express {
    interface Request {
      userId? : string;
    }
  }
}