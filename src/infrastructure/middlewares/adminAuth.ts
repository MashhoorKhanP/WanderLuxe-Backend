import { NextFunction, Request, Response } from "express";
import AdminRepository from "../repositories/adminRepository";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import IAdmin from "../../domain/entities/admin";

interface AuthenticatedRequest extends Request {
  admin?: IAdmin;
}

const adminRepo = new AdminRepository();

declare global {
  namespace Express {
    interface Request {
      adminId?: string;
    }
  }
}

const adminAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.cookies.adminJWT;
    
    if (token) {
      const decoded = jwt.decode(token) as JwtPayload;
      console.log('decodedAdmintoken',decoded);
      if (decoded.role === "admin") {
        const admin = await adminRepo.findByEmail(decoded.email as string);
        if (admin && decoded.role === "admin") {
          next();
        }
      }
    } else {
      return res.status(401).json({
        success: false,
        result: { success: false, message: "Unauthorized Access" },
      });
    }
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

export default adminAuth;
