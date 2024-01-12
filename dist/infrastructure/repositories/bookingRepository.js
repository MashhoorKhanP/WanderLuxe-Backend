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
const bookingModel_1 = __importDefault(require("../database/bookingModel"));
class BookingRepository {
    save(booking) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("bookingRepository", booking);
            const newBooking = new bookingModel_1.default(booking);
            yield newBooking.save();
            return newBooking;
        });
    }
    findById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const booking = yield bookingModel_1.default.findOne({ _id });
            return booking;
        });
    }
    findAllBookings() {
        return __awaiter(this, void 0, void 0, function* () {
            const bookings = yield bookingModel_1.default.find({}).sort({ _id: -1 });
            return bookings;
        });
    }
    findBookingsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userBookings = yield bookingModel_1.default.find({ userId: userId }).sort({
                _id: -1,
            });
            return userBookings;
        });
    }
    findBookingsByHotelId(hotelId) {
        return __awaiter(this, void 0, void 0, function* () {
            const hotelBookings = yield bookingModel_1.default.find({ hotelId: hotelId }).sort({
                _id: -1,
            });
            return hotelBookings;
        });
    }
    findByIdAndUpdate(_id, reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const booking = yield bookingModel_1.default.findByIdAndUpdate(_id, reqBody, {
                new: true,
            });
            return booking;
        });
    }
    findByIdAndUpdateBookingStatus(transactionId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("transactionId from BookingRepository: ", transactionId);
            const booking = yield bookingModel_1.default.findOneAndUpdate({ transactionId: transactionId }, // Assuming your field is named 'roomId'
            { status: status }, { new: true });
            return booking;
        });
    }
}
exports.default = BookingRepository;
