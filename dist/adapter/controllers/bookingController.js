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
Object.defineProperty(exports, "__esModule", { value: true });
class BookingController {
    constructor(BookingUseCase) {
        this.BookingUseCase = BookingUseCase;
    }
    walletPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactionId = "Wallet Payment";
                const receipt_url = "Check wallet history";
                const isWalletBalanceUsed = true;
                const payment = yield this.BookingUseCase.bookRoom(req.body, transactionId, receipt_url, isWalletBalanceUsed);
                if (payment) {
                    return res.status(payment.status).json({
                        success: true,
                        result: Object.assign({}, payment.data),
                    });
                }
                else {
                    res.status(400).json({ success: false, result: {} });
                }
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    payment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.app.locals.booking = req.body;
                const payment = yield this.BookingUseCase.payment(req.body);
                if (payment) {
                    return res.status(payment.status).json({
                        success: true,
                        result: Object.assign({}, payment.data),
                    });
                }
                else {
                    res.status(400).json({ success: false, result: {} });
                }
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    webhook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const localData = req.app.locals.booking;
                let transactionId;
                let receiptUrl;
                if (req.body.type === "charge.succeeded") {
                    transactionId = req.body.data.object.payment_intent;
                    receiptUrl = req.body.data.object.receipt_url;
                }
                const confirmPayment = yield this.BookingUseCase.confirmPayment(req);
                if (confirmPayment) {
                    const booking = yield this.BookingUseCase.bookRoom(localData, transactionId, receiptUrl, localData.isWalletBalanceUsed);
                    return res.status(booking.status).json({
                        success: true,
                        result: Object.assign({}, booking.data),
                    });
                }
                else {
                    res.status(400).json({ success: false, result: {} });
                }
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    getBookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield this.BookingUseCase.getBookings();
                res.status(bookings.status).json({
                    success: true,
                    result: Object.assign({}, bookings.data),
                });
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    getUserBookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const bookings = yield this.BookingUseCase.getUserBookings(userId);
                res.status(bookings.status).json({
                    success: true,
                    result: Object.assign({}, bookings.data),
                });
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    getHotelBookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hotelId = req.params.hotelId;
                const bookings = yield this.BookingUseCase.getHotelBookings(hotelId);
                res.status(bookings.status).json({
                    success: true,
                    result: Object.assign({}, bookings.data),
                });
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    updateBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingId = req.params.bookingId;
                const updatedBooking = yield this.BookingUseCase.updateBooking(bookingId, req.body);
                res.status(200).json({
                    success: true,
                    result: Object.assign({}, updatedBooking.data),
                });
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
}
exports.default = BookingController;
