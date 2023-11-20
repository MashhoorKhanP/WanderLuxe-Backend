import { Request, Response } from "express";
import UserUserCase from "../../useCases/userUseCase";
import GenerateEmail from "../../infrastructure/services/sendMail";
import GenerateOTP from "../../infrastructure/services/generateOtp";

class UserController {
  private userUseCase: UserUserCase;
  private GenerateEmail:GenerateEmail;
  private GenerateOTP: GenerateOTP;

  constructor(userUseCase: UserUserCase, GenerateEmail: GenerateEmail,GenerateOTP: GenerateOTP) {
    this.userUseCase = userUseCase;
    this.GenerateEmail = GenerateEmail;
    this.GenerateOTP = GenerateOTP;
  }

  async signUp(req: Request, res: Response) {
    try {
      const verifyUser = await this.userUseCase.signUp(req.body.email);
      console.log('Entered inside signUp Controller',verifyUser)
      if (verifyUser.data.status === true && req.body.isGoogle) {
        let user = await this.userUseCase.verifyUser(req.body);
        console.log('controller 23 line',user);
        if(user){
          res.status(user.status).json(user.data);
        }

      } else if (verifyUser.data.status === true) {
        
        req.app.locals.userData = req.body;
        const otp = this.GenerateOTP.generateOtp();
        req.app.locals.otp = otp;
        //this.GenerateEmail.sendMail(req.body.email,otp);
        console.log(otp);
        setTimeout(() => {
          req.app.locals.otp = this.GenerateOTP.generateOtp()
        }, 3 * 60000);

        res.status(verifyUser.status).json(verifyUser.data);
      }else {
        res.status(400).json({success:false,result:{...verifyUser.data}}); // This line for toastify error in frontend
      }
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({success:false,error:typedError.message});
    }
  }

  async userVerification(req:Request , res: Response) {
    try{
      if(req.body.otp === req.app.locals.otp){
        const user = await this.userUseCase.verifyUser(req.app.locals.userData);
        if(user){
          req.app.locals.userData = null;
          req.app.locals.otp =null;
          res.status(user.status).json(user.data);
        }
      }else{
        res.status(400).json({status:false, message:'Invalid otp'});
      }
    }catch(error){
      const typedError: Error = error as Error;
      res.status(400).json(typedError.message);
    }
  }
  
  async resendOtp(req:Request, res:Response) {
  try{
    const otp = this.GenerateOTP.generateOtp();
    req.app.locals.otp = otp;
    this.GenerateEmail.sendMail(req.app.locals.userData.email, otp);
    console.log(otp);

    setTimeout(()=>{
      req.app.locals.otp = this.GenerateOTP.generateOtp();
    },3*6000);
    res.status(200).json({message:'Otp has been sent!(resendOtp,backend,userController)'});

  }catch(error){
    const typedError = error as Error;
    res.status(400).json(typedError.message);
  }
}

async login(req:Request, res:Response){
  try{
    const user = await this.userUseCase.login(req.body);
    console.log('Entered inside login Controller',user)
    console.log(user.data.token);
    if(user.data.token){
      console.log('entered inside to set token')
      res.cookie('userJWT',user.data.token,{
        httpOnly:true,
        sameSite:'strict',
        secure:process.env.NODE_ENV !== 'development',
        maxAge : 30 * 24 * 60 * 60 * 1000
      });
      console.log('set cookie ended')
    }
    
    res.status(user.status).json({
      success:true,
      result:{...user.data}
    });
  }catch(error){
    const typedError = error as Error;
    res.status(400).json({success:false,error:typedError.message});
  }
}

};

export default UserController;
