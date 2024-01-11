interface ICoupon {
  _id?: string;
  couponCode: string;
  discountType: string;
  discount: number;
  maxDiscount?: number;
  expiryDate: Date | any;
  couponCount: number;
  description: string;
  isCancelled: boolean;
}

export default ICoupon;
