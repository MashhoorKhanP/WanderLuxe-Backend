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
const hotelSchema = new mongoose_1.Schema({
    longitude: { type: Number, require: true },
    latitude: { type: Number, require: true },
    hotelName: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    distanceFromCityCenter: { type: Number, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    minimumRent: { type: Number, required: true },
    description: { type: String, required: true },
    parkingPrice: { type: Number, default: 0 },
    images: { type: [String] },
    dropImage: {
        type: String,
        default: "https://firebasestorage.googleapis.com/v0/b/wanderluxe-booking-app-87e72.appspot.com/o/WanderLuxe-ExtraImages%2FwanderLuxe.jpg?alt=media&token=edfbe01d-332d-4825-953c-37de30cfab17",
    },
    appliedOffer: { type: String },
}, { timestamps: true });
const HotelModel = mongoose_1.default.model("Hotel", hotelSchema);
exports.default = HotelModel;
