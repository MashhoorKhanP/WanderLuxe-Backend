"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_schedule_1 = __importDefault(require("node-schedule"));
class BookingUseCase {
    constructor(BookingRepository, PaymentRepository, RoomRepository, CouponRepository, UserRepository) {
        this.BookingRepository = BookingRepository;
        this.PaymentRepository = PaymentRepository;
        this.RoomRepository = RoomRepository;
        this.CouponRepository = CouponRepository;
        this.UserRepository = UserRepository;
    }
    payment(bookingData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (bookingData) {
                const paymentData = yield this.PaymentRepository.confirmPayment(bookingData);
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: paymentData,
                    },
                };
            }
            else {
                return {
                    status: 400,
                    data: {
                        status: false,
                        success: false,
                        message: "Something went wrong in payment!",
                    },
                };
            }
        });
    }
    confirmPayment(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const paymentSuccess = yield this.PaymentRepository.paymentSuccess(request);
            if (!paymentSuccess) {
                console.log("Payment faileddddd");
                return null;
            }
            else {
                return true;
            }
        });
    }
    bookRoom(bookingDetails, transactionId, receiptUrl, isWalletBalanceUsed) {
        return __awaiter(this, void 0, void 0, function* () {
            let booking;
            if (isWalletBalanceUsed === true) {
                const user = yield this.UserRepository.findById(bookingDetails.userId);
                const walletHistory = {
                    transactionDate: new Date(),
                    transactionDetails: "Room Booking",
                    transactionType: "Debit",
                    transactionId: transactionId,
                    transactionAmount: bookingDetails.paymentMethod === "Wallet Payment"
                        ? bookingDetails.totalAmount
                        : user === null || user === void 0 ? void 0 : user.wallet,
                    currentBalance: bookingDetails.paymentMethod === "Wallet Payment"
                        ? (user === null || user === void 0 ? void 0 : user.wallet) - bookingDetails.totalAmount
                        : 0,
                };
                const bookingData = {
                    firstName: bookingDetails.firstName,
                    lastName: bookingDetails.lastName,
                    email: bookingDetails.email,
                    mobile: bookingDetails.mobile,
                    roomId: bookingDetails.roomId,
                    hotelId: bookingDetails.hotelId,
                    userId: bookingDetails.userId,
                    roomType: bookingDetails.roomType,
                    hotelName: bookingDetails.hotelName,
                    roomImage: bookingDetails.roomImage,
                    totalRoomsCount: bookingDetails.totalRoomsCount,
                    checkInDate: bookingDetails.checkInDate,
                    checkOutDate: bookingDetails.checkOutDate,
                    checkInTime: bookingDetails.checkInTime,
                    checkOutTime: bookingDetails.checkOutTime,
                    appliedCouponId: bookingDetails.appliedCouponId,
                    couponDiscount: bookingDetails.couponDiscount,
                    numberOfNights: bookingDetails.numberOfNights,
                    totalAmount: bookingDetails.paymentMethod === "Wallet Payment"
                        ? bookingDetails.totalAmount
                        : bookingDetails.totalAmount + (user === null || user === void 0 ? void 0 : user.wallet),
                    adults: bookingDetails.adults,
                    children: bookingDetails.children,
                    status: bookingDetails.status,
                    transactionId: bookingDetails.transactionId,
                    receiptUrl: bookingDetails.receiptUrl,
                    paymentMethod: bookingDetails.paymentMethod,
                };
                const updatedUser = yield this.UserRepository.findByIdAndUpdateWallet(bookingDetails.userId, -walletHistory.transactionAmount, walletHistory);
                booking = yield this.BookingRepository.save(Object.assign(Object.assign({}, bookingData), { transactionId,
                    receiptUrl }));
            }
            else {
                booking = yield this.BookingRepository.save(Object.assign(Object.assign({}, bookingDetails), { transactionId,
                    receiptUrl }));
            }
            if (bookingDetails.appliedCouponId !== "No Coupon Applied") {
                const appliedCoupon = this.CouponRepository.findByIdAndUpdateCount(bookingDetails.appliedCouponId);
            }
            const today = new Date();
            const scheduledCheckOutDate = new Date(bookingDetails.checkOutDate);
            const scheduledCheckInDate = new Date(bookingDetails.checkInDate);
            // Add one more day to the checkOutDate
            scheduledCheckOutDate.setDate(scheduledCheckOutDate.getDate() + 1);
            // Add one more day to the checkInDate
            scheduledCheckInDate.setDate(scheduledCheckInDate.getDate() + 1);
            today.setUTCHours(0, 0, 0, 0);
            scheduledCheckOutDate.setUTCHours(0, 0, 0, 0);
            scheduledCheckInDate.setUTCHours(0, 0, 0, 0);
            //Schedule for check-out
            if (scheduledCheckOutDate <= today) {
                node_schedule_1.default.scheduleJob(scheduledCheckOutDate, () => __awaiter(this, void 0, void 0, function* () {
                    const checkOutStatus = "Checked-Out";
                    const updatedBookingStatus = yield this.BookingRepository.findByIdAndUpdateBookingStatus(
                    // findby roomId and change status
                    transactionId, checkOutStatus);
                    const roomStatus = "Available";
                    const updatedRoomStatus = yield this.RoomRepository.findByIdAndUpdateRoomStatus(
                    // findby roomId and change status
                    bookingDetails.roomId, roomStatus);
                    // Update rooms count after check-out
                    // const room = await this.RoomRepository.findByIdAndUpdateRoomsCount(
                    //   bookingDetails.roomId,
                    //   bookingDetails.totalRoomsCount
                    // );
                }));
            }
            // Schedule for check-in if it is today
            if (scheduledCheckInDate.toISOString() === today.toISOString()) {
                const checkInStatus = "On Check-In";
                const updatedBookingStatus = yield this.BookingRepository.findByIdAndUpdateBookingStatus(transactionId, checkInStatus);
                const roomStatus = "Occupied";
                const updatedRoomStatus = yield this.RoomRepository.findByIdAndUpdateRoomStatus(
                // findby roomId and change status
                bookingDetails.roomId, roomStatus);
                // Update rooms count after check-in
                // const room = await this.RoomRepository.findByIdAndUpdateRoomsCount(
                //   bookingDetails.roomId,
                //   -bookingDetails.totalRoomsCount
                // );
            }
            if (booking) {
                return {
                    status: 200,
                    data: {
                        success: true,
                        successUrl: `${process.env.CLIENT_URL}/payment-success`,
                        failedUrl: `${process.env.CLIENT_URL}/payment-failed`,
                        message: booking,
                    },
                };
            }
            else {
                return {
                    status: 400,
                    data: {
                        status: false,
                        success: false,
                        message: "Something went wrong in booking!",
                    },
                };
            }
        });
    }
    getBookings() {
        return __awaiter(this, void 0, void 0, function* () {
            const bookings = yield this.BookingRepository.findAllBookings();
            return {
                status: 200,
                data: {
                    success: true,
                    message: bookings,
                },
            };
        });
    }
    getUserBookings(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookings = yield this.BookingRepository.findBookingsByUserId(userId);
            return {
                status: 200,
                data: {
                    success: true,
                    message: bookings,
                },
            };
        });
    }
    getHotelBookings(hotelId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookings = yield this.BookingRepository.findBookingsByHotelId(hotelId);
            return {
                status: 200,
                data: {
                    success: true,
                    message: bookings,
                },
            };
        });
    }
    updateBooking(bookingId, reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedBooking = yield this.BookingRepository.findByIdAndUpdate(bookingId, reqBody);
            const { status, userId, roomId } = reqBody;
            if (status === "Cancelled by Admin" || status === "Cancelled") {
                const user = yield this.UserRepository.findById(userId);
                const walletHistory = {
                    transactionDate: new Date(),
                    transactionDetails: "Room Booking Refund",
                    transactionType: "Credit",
                    transactionId: updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.transactionId,
                    transactionAmount: updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.totalAmount,
                    currentBalance: ((user === null || user === void 0 ? void 0 : user.wallet) +
                        (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.totalAmount)),
                };
                const updatedUser = yield this.UserRepository.findByIdAndUpdateWallet(userId, walletHistory.transactionAmount, walletHistory);
                const updateRoomStatus = yield this.RoomRepository.findByIdAndUpdateRoomStatus(roomId, "Available");
            }
            if (updatedBooking) {
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: updatedBooking,
                    },
                };
            }
            else {
                return {
                    status: 400,
                    data: {
                        success: false,
                        message: `Updating booking failed`,
                    },
                };
            }
        });
    }
}
exports.default = BookingUseCase;
