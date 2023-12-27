import { Request, Response } from "express";
import AdminUseCase from "../../useCases/adminUseCase";

class AdminController {
  private adminUseCase: AdminUseCase;
  constructor(adminUseCase: AdminUseCase) {
    this.adminUseCase = adminUseCase;
  }

  async login(req: Request, res: Response) {
    try {
      const admin = await this.adminUseCase.login(req.body);
      if (admin.data.token) {
        res.cookie("adminJWT", admin.data.token, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
      }
      res.status(admin.status).json({
        success: true,
        result: { ...admin.data },
      });
    } catch (error) {
      const typedError = error as Error;
      console.error("Error setting cookie:", typedError);
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await this.adminUseCase.getUsers();
      res.status(users.status).json({
        success: true,
        result: { ...users.data },
      });
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  async updateUsers(req: Request, res: Response) {
    try {
      const userId = req.params.userId as string;
      const { isVerified, isBlocked } = req.body;
      const updatedUser = await this.adminUseCase.updateUser(
        userId,
        isVerified,
        isBlocked
      );
      res.status(updatedUser.status as number).json({
        success: true,
        result: { updatedUser },
      });
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }
}

export default AdminController;
