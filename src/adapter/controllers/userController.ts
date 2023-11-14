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

      if (verifyUser.data.status === true && req.body.isGoogle) {
        let user = await this.userUseCase.verifyUser(req.body);
        res.status(user.status).json(user.data);

      } else if (verifyUser.data.status === true) {
        
        req.app.locals.userData = req.body;
        const otp = this.GenerateOTP.generateOtp();
        req.app.locals.otp = otp;
        this.GenerateEmail.sendMail(req.body.email,otp);
        console.log(otp);
        setTimeout(() => {
          req.app.locals.otp = this.GenerateOTP.generateOtp()
        }, 3 * 60000);

        res.status(verifyUser.status).json(verifyUser.data);
      }else {
        res.status(verifyUser.status).json(verifyUser.data);
      }
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json(err.message);
    }
  }
}

export default UserController;
