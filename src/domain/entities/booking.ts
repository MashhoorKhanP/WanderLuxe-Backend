interface IBooking {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  roomId: string;
  hotelId: string;
  userId: string;
  roomType: string;
  hotelName: string;
  roomImage: string;
  totalRoomsCount: number;
  checkInDate: Date | any;
  checkOutDate: Date | any;
  checkInTime: string | any;
  checkOutTime: string | any;
  appliedCouponId: string;
  couponDiscount: number;
  numberOfNights: number;
  totalAmount: number;
  adults: number;
  children: number;
  status: string;
  transactionId: string;
  receiptUrl: string;
  paymentMethod: string;
}

export default IBooking;
