import ICoupon from "../../domain/entities/coupon";

interface CouponRepo {
  save(coupon: ICoupon): Promise<ICoupon>;
  findById(_id: string): Promise<ICoupon | null>;
  findAllCoupons(): Promise<{}[] | null>;
  findAndDeleteCoupon(couponId: string): Promise<string | null>;
  findByIdAndUpdate(_id: string, reqBody: object): Promise<ICoupon | null>;
  findByIdAndUpdateCount(_id: string): Promise<ICoupon | null>;
}

export default CouponRepo;
