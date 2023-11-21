import jwt,{JwtPayload} from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import UserRepository from '../repositories/userRepository';

const userRepo = new UserRepository();

declare global{
  namespace Express {
    interface Request {
      userId? : string;
    }
  }
}

const userAuth = async (req:Request, res:Response, next:NextFunction) => {
  let token; 
      token = req.cookies.userJWT;
      console.log(token);
      if(token){
        try{
          const decoded = jwt.verify(token!,process.env.JWT_SECRET as string) as JwtPayload;
          
          const user = await userRepo.findById(decoded.userId as string);
          if(user){
            req.userId = user._id;
            if(user.isBlocked){
              return res.status(401).json({success:false,message: 'You are blocked by admin!'});
            }else{
              next();
            }
          }else{
            return res.status(401).json({success:false,message:'Not authorized,invalid token'});
          }
        }catch(error){
          return res.status(401).json({success:false,message:'Not authorized,invalid token'});
        }
      }else{
        return res.status(401).json({success:false,message:'Not authorized,invalid token'});
      }
};

export default userAuth;