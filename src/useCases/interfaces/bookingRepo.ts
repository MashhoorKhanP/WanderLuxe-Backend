import IBooking from "../../domain/entities/booking";

interface BookingRepo{
  save(booking:IBooking) : Promise<IBooking>;
  findById(_id:string):Promise<IBooking | null>;
  findAllBookings():Promise<{}[] | null>;
  findBookingsByUserId(userId:string):Promise<IBooking[] | null>;
  findByIdAndUpdate(
      _id: string,
      reqBody: object
    ): Promise<IBooking | null>;
  // findAndDeleteCoupon(couponId: string): Promise<string | null>
}

export default BookingRepo;