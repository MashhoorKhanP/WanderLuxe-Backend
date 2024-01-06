
import IBooking from "../domain/entities/booking";
import schedule from "node-schedule";
import BookingRepository from "../infrastructure/repositories/bookingRepository";
import RoomRepository from "../infrastructure/repositories/roomRepository";
import PaymentRepository from "../infrastructure/services/stripe";
import CouponRepository from "../infrastructure/repositories/couponRepository";
import UserRepository from "../infrastructure/repositories/userRepository";

class BookingUseCase {
  private BookingRepository: BookingRepository;
  private PaymentRepository: PaymentRepository;
  private RoomRepository: RoomRepository;
  private CouponRepository: CouponRepository;
  private UserRepository: UserRepository;
  

  constructor(BookingRepository: BookingRepository, PaymentRepository: PaymentRepository,RoomRepository: RoomRepository,CouponRepository: CouponRepository,UserRepository : UserRepository) {
    this.BookingRepository = BookingRepository;
    this.PaymentRepository = PaymentRepository;
    this.RoomRepository = RoomRepository;
    this.CouponRepository = CouponRepository;
    this.UserRepository = UserRepository;

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

  async bookRoom(bookingDetails:IBooking,transactionId:string,receiptUrl:string,isWalletBalanceUsed:boolean){
    console.log('bookingDetails',bookingDetails)
    console.log('transactionId',transactionId)
    console.log('receiptUrl',receiptUrl)
    let booking;
    console.log('isWalletBalanceUsed',isWalletBalanceUsed);
    if(isWalletBalanceUsed===true){
      const user=await this.UserRepository.findById(bookingDetails.userId);
    
    const walletHistory = {
      transactionDate: new Date(),
      transactionDetails: 'Room Booking',
      transactionType: 'Debit',
      transactionId:transactionId,
      transactionAmount:bookingDetails.paymentMethod === 'Wallet Payment' ? bookingDetails.totalAmount :user?.wallet as number,
      currentBalance: bookingDetails.paymentMethod === 'Wallet Payment' ? user?.wallet as number - bookingDetails.totalAmount : 0
  }

    const bookingData = {
      firstName : bookingDetails.firstName,
      lastName : bookingDetails.lastName,
      email : bookingDetails.email,
      mobile : bookingDetails.mobile,
      roomId: bookingDetails.roomId,
      hotelId:bookingDetails.hotelId,
      userId: bookingDetails.userId,
      roomType: bookingDetails.roomType,
      hotelName: bookingDetails.hotelName,
      roomImage: bookingDetails.roomImage,
      totalRoomsCount:bookingDetails.totalRoomsCount,
      checkInDate:bookingDetails.checkInDate,
      checkOutDate:bookingDetails.checkOutDate,
      checkInTime:bookingDetails.checkInTime,
      checkOutTime:bookingDetails.checkOutTime,
      appliedCouponId:bookingDetails.appliedCouponId,
      couponDiscount:bookingDetails.couponDiscount,
      numberOfNights:bookingDetails.numberOfNights,
      totalAmount:bookingDetails.paymentMethod === 'Wallet Payment' ? bookingDetails.totalAmount :bookingDetails.totalAmount + user?.wallet ,
      adults: bookingDetails.adults,
      children:bookingDetails.children,
      status: bookingDetails.status,
      transactionId:bookingDetails.transactionId,
      receiptUrl:bookingDetails.receiptUrl,
      paymentMethod:bookingDetails.paymentMethod,
    }
    const updatedUser =await this.UserRepository.findByIdAndUpdateWallet(bookingDetails.userId,-walletHistory.transactionAmount,walletHistory);
    booking=await this.BookingRepository.save({...bookingData,transactionId,receiptUrl});
    }else{

      booking=await this.BookingRepository.save({...bookingDetails,transactionId,receiptUrl});
    }
    
    if(bookingDetails.appliedCouponId !== 'No Coupon Applied'){
      const appliedCoupon = this.CouponRepository.findByIdAndUpdateCount(bookingDetails.appliedCouponId)
    }
    const today = new Date();
    const scheduledCheckOutDate = new Date(bookingDetails.checkOutDate);
    const scheduledCheckInDate = new Date(bookingDetails.checkInDate);

  // Add one more day to the checkOutDate
  scheduledCheckOutDate.setDate(scheduledCheckOutDate.getDate() + 1);
  console.log('Scheduled Check-Out Date:', scheduledCheckOutDate,'scheduledCheckOutDate',scheduledCheckOutDate.getTime(),'today', today.getTime());
  
  // Add one more day to the checkInDate
  scheduledCheckInDate.setDate(scheduledCheckInDate.getDate() + 1);
  console.log('Scheduled Check-In Date:', scheduledCheckInDate);
    today.setUTCHours(0, 0, 0, 0);
    scheduledCheckOutDate.setUTCHours(0, 0, 0, 0);
    scheduledCheckInDate.setUTCHours(0, 0, 0, 0);
  //Schedule for check-out
  console.log('ScheduledCheckOutDate===')
   if (scheduledCheckOutDate <= today) {
      schedule.scheduleJob(scheduledCheckOutDate, async () => {
        const checkOutStatus = 'Checked-Out';
        const updatedBookingStatus = await this.BookingRepository.findByIdAndUpdateBookingStatus(  // findby roomId and change status
          transactionId,
          checkOutStatus
        );

        const roomStatus = 'Available';
        const updatedRoomStatus = await this.RoomRepository.findByIdAndUpdateRoomStatus(  // findby roomId and change status
          bookingDetails.roomId,
          roomStatus
        );

      // Update rooms count after check-out
        // const room = await this.RoomRepository.findByIdAndUpdateRoomsCount(
        //   bookingDetails.roomId,
        //   bookingDetails.totalRoomsCount
        // );

      });

  }
  // Schedule for check-in if it is today
  if (scheduledCheckInDate.toISOString() === today.toISOString()) {
    const checkInStatus = 'On Check-In';
    const updatedBookingStatus = await this.BookingRepository.findByIdAndUpdateBookingStatus(
      transactionId,
      checkInStatus
    );

     const roomStatus = 'Occupied';
     const updatedRoomStatus = await this.RoomRepository.findByIdAndUpdateRoomStatus(  // findby roomId and change status
       bookingDetails.roomId,
       roomStatus
     );

    // Update rooms count after check-in
    // const room = await this.RoomRepository.findByIdAndUpdateRoomsCount(
    //   bookingDetails.roomId,
    //   -bookingDetails.totalRoomsCount
    // );
  }


    if(booking){
      return {
        status: 200,
        data: {
          success: true,
          successUrl:`${process.env.CLIENT_URL}/payment-success`,
          failedUrl:`${process.env.CLIENT_URL}/payment-failed`,
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

  async getHotelBookings(hotelId:string) {
    const bookings = await this.BookingRepository.findBookingsByHotelId(hotelId);
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
      reqBody as any
    );
    
    const {status, userId} = reqBody as any;
    if(status === 'Cancelled by Admin' || status === 'Cancelled'){

    console.log('reqBody',reqBody)
    const user=await this.UserRepository.findById(userId);
    
    const walletHistory = {
      transactionDate: new Date(),
      transactionDetails: 'Room Booking Refund',
      transactionType: 'Credit',
      transactionId:updatedBooking?.transactionId,
      transactionAmount:updatedBooking?.totalAmount,
      currentBalance: user?.wallet as number + updatedBooking?.totalAmount as any
  }
    const updatedUser =await this.UserRepository.findByIdAndUpdateWallet(userId,walletHistory.transactionAmount,walletHistory);
    }

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
