import { Request,Response } from "express";
import AdminUseCase from "../../useCases/adminUseCase";

class AdminController {
  private adminUseCase: AdminUseCase;
  constructor(adminUseCase: AdminUseCase) {
    this.adminUseCase = adminUseCase;
  }

  async login(req: Request, res: Response) {
    try {
      const admin = await this.adminUseCase.login(req.body);
      console.log('Entered inside admin controller admin',admin)
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


}

export default AdminController;
