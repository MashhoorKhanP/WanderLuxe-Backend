import ICoupon from "../../domain/entities/coupon";
import CouponRepo from "../../useCases/interfaces/couponRepo";
import CouponModel from "../database/couponModel";

class CouponRepository implements CouponRepo {
  async save(coupon: ICoupon): Promise<ICoupon> {
    console.log("couponRepository", coupon);
    const newCoupon = new CouponModel(coupon);
    await newCoupon.save();
    return newCoupon;
  }

  async findById(_id: string): Promise<ICoupon | null> {
    const coupon = await CouponModel.findOne({ _id });
    return coupon;
  }

  async findAllCoupons(): Promise<{}[] | null> {
    const coupons = await CouponModel.find({}).sort({ _id: -1 });
    return coupons;
  }

  async findAndDeleteCoupon(couponId: string): Promise<string | null> {
    const deletedCoupon = await CouponModel.findByIdAndDelete(couponId);
    if (deletedCoupon) {
      const { _id } = deletedCoupon;
      return _id.toString();
    }
    return null;
  }

  async findByIdAndUpdate(
    _id: string,
    reqBody: object
  ): Promise<ICoupon | null> {
    const coupon = await CouponModel.findByIdAndUpdate(_id, reqBody, {
      new: true,
    });
    return coupon;
  }

  async findByIdAndUpdateCount(_id: string): Promise<ICoupon | null> {
    const coupon = await CouponModel.findByIdAndUpdate(
      _id,
      { $inc: { couponCount: -1 } }, // Use $inc to decrease couponCount by 1
      { new: true }
    );

    return coupon;
  }
}

export default CouponRepository;
