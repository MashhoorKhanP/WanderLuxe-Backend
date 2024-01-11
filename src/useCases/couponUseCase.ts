import ICoupon from "../domain/entities/coupon";
import CouponRepository from "../infrastructure/repositories/couponRepository";

class CouponUseCase {
  private CouponRepository: CouponRepository;

  constructor(CouponRepository: CouponRepository) {
    this.CouponRepository = CouponRepository;
  }
  //Admin side
  async addCoupon(coupon: ICoupon) {
    if (coupon) {
      await this.CouponRepository.save({ ...coupon });
      return {
        status: 200,
        data: {
          success: true,
          message: coupon,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: false,
          success: false,
          message: "Something went wrong in adding the coupon!",
        },
      };
    }
  }

  async deleteCoupon(couponId: string) {
    const _id = await this.CouponRepository.findAndDeleteCoupon(couponId);
    return {
      status: 200,
      data: {
        success: true,
        message: _id,
      },
    };
  }

  async updateCoupon(couponId: string, reqBody: object) {
    const updatedCoupon = await this.CouponRepository.findByIdAndUpdate(
      couponId,
      reqBody
    );
    if (updatedCoupon) {
      return {
        status: 200,
        data: {
          success: true,
          message: updatedCoupon,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          success: false,
          message: `Updating coupon failed`,
        },
      };
    }
  }

  //User side
  async getCoupons() {
    const coupons = await this.CouponRepository.findAllCoupons();
    return {
      status: 200,
      data: {
        success: true,
        message: coupons,
      },
    };
  }
}

export default CouponUseCase;
