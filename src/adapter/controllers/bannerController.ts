import { Request, Response } from "express";
import BannerUseCase from "../../useCases/bannerUseCase";

class BannerController {
  private BannerUseCase: BannerUseCase;

  constructor(BannerUseCase: BannerUseCase) {
    this.BannerUseCase = BannerUseCase;
  }
  
  async updateBanners(req: Request, res: Response) {
    try {
      const bannerId = req.params.bannerId;
      const updatedCoupon = await this.BannerUseCase.updateBanners(
        bannerId,
        req.body
      );
      res.status(200).json({
        success: true,
        result: { ...updatedCoupon.data },
      });
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  //User side
  async getBanners(req: Request, res: Response) {
    try {
      const banners = await this.BannerUseCase.getBanners();
      res.status(banners.status).json({
        success: true,
        result: { ...banners.data },
      });
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }
}

export default BannerController;
