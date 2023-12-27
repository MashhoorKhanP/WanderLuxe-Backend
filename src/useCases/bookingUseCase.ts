
import IBooking from "../domain/entities/booking";
import BookingRepository from "../infrastructure/repositories/bookingRepository";
import PaymentRepository from "../infrastructure/services/stripe";

class BookingUseCase {
  private BookingRepository: BookingRepository;
  private PaymentRepository: PaymentRepository;

  constructor(BookingRepository: BookingRepository, PaymentRepository: PaymentRepository) {
    this.BookingRepository = BookingRepository;
    this.PaymentRepository = PaymentRepository;
  }

  async payment(bookingData: IBooking) {
    if (bookingData) {
      const paymentData = await this.PaymentRepository.confirmPayment(bookingData)
      return {
        status: 200,
        data: {
          success: true,
          message:paymentData,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: false,
          success: false,
          message: "Something went wrong in payment!",
        },
      };
    }
  }

  async confirmPayment(request:any) {
    const paymentSuccess = await this.PaymentRepository.paymentSuccess(request)
    console.log('reached confirmPayment UseCase',paymentSuccess);
    if(!paymentSuccess){
      console.log("Payment faileddddd");
      return null;
    }else{
      return true;
    }
  }


  async bookRoom(bookingDetails:IBooking,transactionId:string,receiptUrl:string){
    console.log('bookingDetails',bookingDetails)
    console.log('transactionId',transactionId)
    console.log('receiptUrl',receiptUrl)
    const booking=await this.BookingRepository.save({...bookingDetails,transactionId,receiptUrl});
    if(booking){
      return {
        status: 200,
        data: {
          success: true,
          message:booking,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: false,
          success: false,
          message: "Something went wrong in booking!",
        },
      };
    }
  }
  
  async getBookings() {
    const bookings = await this.BookingRepository.findAllBookings();
    return {
      status: 200,
      data: {
        success: true,
        message: bookings,
      },
    };
  }

  async getUserBookings(userId:string) {
    const bookings = await this.BookingRepository.findBookingsByUserId(userId);
    return {
      status: 200,
      data: {
        success: true,
        message: bookings,
      },
    };
  }

  async updateBooking(bookingId: string, reqBody: object) {
    const updatedBooking = await this.BookingRepository.findByIdAndUpdate(
      bookingId,
      reqBody
    );
    if (updatedBooking) {
      return {
        status: 200,
        data: {
          success: true,
          message: updatedBooking,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          success: false,
          message: `Updating booking failed`,
        },
      };
    }
  }
  // async deleteHotel(hotelId: string) {
  //   const _id = await this.HotelRepository.findAndDeleteHotel(hotelId);
  //   return {
  //     status: 200,
  //     data: {
  //       success: true,
  //       message: _id,
  //     },
  //   };
  // }


  
}

export default BookingUseCase;
