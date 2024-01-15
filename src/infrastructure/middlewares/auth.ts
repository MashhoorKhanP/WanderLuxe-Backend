import { NextFunction, Request, Response } from "express";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import IGoogleAuthUser from "../../domain/entities/googleAuth";
import UserRepository from "../repositories/userRepository";
import jwt, { JwtPayload} from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface AuthenticatedRequest extends Request {
  user?: IGoogleAuthUser;
}

const userRepo = new UserRepository();

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const auth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // const token = req.headers.authorization?.split(" ")[1];
    // const googleToken = token?.length! > 1000;

    // if (googleToken) {
    //   const ticket = await client.verifyIdToken({
    //     idToken: token!,
    //     audience: process.env.GOOGLE_CLIENT_ID!,
    //   });

    //   const payload = ticket.getPayload();
    //   const userPayload: TokenPayload = payload as TokenPayload;

    //   req.user = {
    //     _id: userPayload?.sub!,
    //     firstName: userPayload?.given_name!,
    //     lastName: userPayload?.family_name!,
    //     email: userPayload?.email!,
    //     profileImage: userPayload?.picture!,
    //   };
    // } else {
      // To do: verify our custom jwt token
      let token;
      token = req.cookies.userJWT;
      console.log("tokeen",token);
      if (token) {
        const decoded = jwt.decode(token) as JwtPayload;
        if (decoded.role === "user") {
          const user = await userRepo.findById(decoded._id as string);
          if (user && decoded.role === "user") {
            req.userId = user._id;
            if (user.isBlocked) {
              return res.status(401).json({
                success: false,
                result: {
                  success: false,
                  message: "You have been blocked by admin!",
                },
              });
            } else {
              next();
            }
          }
        }
      } else {
        return res.status(401).json({
          success: false,
          result: { success: false, message: "Unauthorized Access" },
        });
      }
    // }
  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      result: {
        success: false,
        message: "Something went wrong with your authorization",
      },
    });
  }
};

export default auth;
