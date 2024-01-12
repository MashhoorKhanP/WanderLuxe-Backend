"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bookingSchema = new mongoose_1.Schema({
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: { type: String, require: true },
    mobile: { type: String, require: true },
    roomId: { type: String, require: true },
    hotelId: { type: String, require: true },
    userId: { type: String, require: true },
    roomType: { type: String, require: true },
    hotelName: { type: String, require: true },
    roomImage: { type: String, require: true },
    totalRoomsCount: { type: Number, require: true },
    checkInDate: { type: String, require: true },
    checkOutDate: { type: String, require: true },
    checkInTime: { type: String, require: true },
    checkOutTime: { type: String, require: true },
    appliedCouponId: { type: String, require: true },
    couponDiscount: { type: Number },
    numberOfNights: { type: Number, require: true },
    totalAmount: { type: Number, require: true },
    adults: { type: Number, require: true },
    children: { type: Number, require: true },
    status: { type: String, require: true, default: "Confirmed" },
    transactionId: { type: String },
    receiptUrl: { type: String },
    paymentMethod: { type: String },
}, {
    timestamps: true,
});
const BookingModel = mongoose_1.default.model("Booking", bookingSchema);
exports.default = BookingModel;
