import { Request, Response } from "express";
import CouponUseCase from "../../useCases/couponUseCase";

class CouponController {
  private CouponUseCase: CouponUseCase;

  constructor(CouponUseCase: CouponUseCase) {
    this.CouponUseCase = CouponUseCase;
  }
  //Admin Side
  async addCoupon(req: Request, res: Response) {
    try {
      const newCoupon = await this.CouponUseCase.addCoupon(req.body);
      console.log("newCoupon", newCoupon);
      if (newCoupon) {
        return res.status(newCoupon.status).json({
          success: true,
          result: { ...newCoupon.data },
        });
      } else {
        res.status(400).json({ success: false, result: {} });
      }
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  async deleteCoupon(req: Request, res: Response) {
    try {
      const couponId = req.params.couponId;
      console.log(couponId);
      const coupon = this.CouponUseCase.deleteCoupon(couponId);
      return res.status(200).json({
        success: true,
        result: { coupon },
      });
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  async updateCoupon(req: Request, res: Response) {
    try {
      const couponId = req.params.couponId;
      const updatedCoupon = await this.CouponUseCase.updateCoupon(
        couponId,
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
  async getCoupons(req: Request, res: Response) {
    try {
      const coupons = await this.CouponUseCase.getCoupons();
      res.status(coupons.status).json({
        success: true,
        result: { ...coupons.data },
      });
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }
}

export default CouponController;
