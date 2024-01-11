import mongoose, { Document, Model, Schema } from "mongoose";
import ICoupon from "../../domain/entities/coupon";

const couponSchema: Schema = new Schema<ICoupon & Document>(
  {
    couponCode: { type: String, required: true },
    discountType: { type: String, required: true },
    discount: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    couponCount: { type: Number, required: true },
    description: { type: String, required: true },
    maxDiscount: { type: Number },
    isCancelled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CouponModel: Model<ICoupon & Document> = mongoose.model<
  ICoupon & Document
>("Coupon", couponSchema);

export default CouponModel;
