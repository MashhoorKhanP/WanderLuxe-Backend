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
const hotelModel_1 = __importDefault(require("../database/hotelModel"));
class HotelRepository {
    save(hotel) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("hotelRepository", hotel);
            const newHotel = new hotelModel_1.default(hotel);
            yield newHotel.save();
            return newHotel;
        });
    }
    findById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const hotel = yield hotelModel_1.default.findOne({ _id });
            return hotel;
        });
    }
    findAllHotels() {
        return __awaiter(this, void 0, void 0, function* () {
            const hotels = yield hotelModel_1.default.find({}).sort({ _id: -1 });
            return hotels;
        });
    }
    findAndDeleteHotel(hotelId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedHotel = yield hotelModel_1.default.findByIdAndDelete(hotelId);
            // Check if the hotel was deleted
            if (deletedHotel) {
                // Access the _id property of the deleted document
                const { _id } = deletedHotel;
                return _id.toString(); // Assuming _id is an ObjectId, convert it to a string
            }
            // If no hotel was deleted, return null
            return null;
        });
    }
    findByIdAndUpdate(_id, reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const hotel = yield hotelModel_1.default.findByIdAndUpdate(_id, reqBody, {
                new: true,
            });
            return hotel;
        });
    }
}
exports.default = HotelRepository;
