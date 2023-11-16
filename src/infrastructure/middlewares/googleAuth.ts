import { NextFunction, Request, Response } from 'express';
import {OAuth2Client, TokenPayload} from 'google-auth-library';
import IUser from '../../domain/entities/user';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

const googleAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const googleToken = token?.length! > 1000;

    if (googleToken) {
      const ticket = await client.verifyIdToken({
        idToken: token!,
        audience: process.env.GOOGLE_CLIENT_ID!,
      });

      const payload = ticket.getPayload();
      const userPayload: TokenPayload = payload as TokenPayload;

      req.user = {
        _id: userPayload?.sub!,
        firstName: userPayload?.given_name!,
        lastName: userPayload?.family_name!,
        email: userPayload?.email!,
        profileImage: userPayload?.picture!,
      };
      console.log(req.user);
      console.log("googleAuth successful")
    } else {
      // To do: verify our custom jwt token
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: 'Something went wrong with your authorization' });
  }
};

export default googleAuth;