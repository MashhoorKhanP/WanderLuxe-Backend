import IBooking from "../../domain/entities/booking";
import BookingRepo from "../../useCases/interfaces/bookingRepo";
import BookingModel from "../database/bookingModel";


class BookingRepository implements BookingRepo {
  async save(booking: IBooking): Promise<IBooking
  > {
    console.log("bookingRepository", booking);
    const newBooking = new BookingModel(booking);
    await newBooking.save();
    return newBooking;
  }

  async findById(_id: string): Promise<IBooking | null> {
    const booking = await BookingModel.findOne({ _id });
    return booking;
  }

  async findAllBookings(): Promise<{}[] | null> {
    const bookings = await BookingModel.find({}).sort({ _id: -1 });
    return bookings;
  }

  async findBookingsByUserId(userId: string): Promise<IBooking[] | null> {
      const userBookings = await BookingModel.find({userId:userId}).sort({_id:-1});
      return userBookings;
  }
  

  async findBookingsByHotelId(hotelId: string): Promise<IBooking[] | null> {
    const hotelBookings = await BookingModel.find({hotelId:hotelId}).sort({_id:-1});
    return hotelBookings;
  }

  async findByIdAndUpdate(
    _id: string,
    reqBody: object
  ): Promise<IBooking | any> {
    const booking = await BookingModel.findByIdAndUpdate(_id, reqBody, {
      new: true,
    });
    return booking;
  }

  async findByIdAndUpdateBookingStatus(transactionId: string, status: string): Promise<IBooking | null> {
    console.log('transactionId from BookingRepository: ', transactionId);
    const booking = await BookingModel.findOneAndUpdate(
      { transactionId:transactionId }, // Assuming your field is named 'roomId'
      { status: status },
      { new: true })
    return booking;
  }
  
  // async findAndDeleteHotel(hotelId: string): Promise<string | null> {
  //   const deletedHotel = await HotelModel.findByIdAndDelete(hotelId);
  //   // Check if the hotel was deleted
  //   if (deletedHotel) {
  //     // Access the _id property of the deleted document
  //     const { _id } = deletedHotel;
  //     return _id.toString(); // Assuming _id is an ObjectId, convert it to a string
  //   }
  //   // If no hotel was deleted, return null
  //   return null;
  // }
}

export default BookingRepository;
