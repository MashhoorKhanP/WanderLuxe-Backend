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
class HotelUseCase {
    constructor(HotelRepository) {
        this.HotelRepository = HotelRepository;
    }
    //Admin side
    addHotel(hotel) {
        return __awaiter(this, void 0, void 0, function* () {
            if (hotel) {
                yield this.HotelRepository.save(Object.assign({}, hotel));
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: hotel,
                    },
                };
            }
            else {
                return {
                    status: 400,
                    data: {
                        status: false,
                        success: false,
                        message: "Something went wrong in adding the hotel!",
                    },
                };
            }
        });
    }
    deleteHotel(hotelId) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = yield this.HotelRepository.findAndDeleteHotel(hotelId);
            return {
                status: 200,
                data: {
                    success: true,
                    message: _id,
                },
            };
        });
    }
    updateHotel(hotelId, reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedHotel = yield this.HotelRepository.findByIdAndUpdate(hotelId, reqBody);
            if (updatedHotel) {
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: updatedHotel,
                    },
                };
            }
            else {
                return {
                    status: 400,
                    data: {
                        success: false,
                        message: `Updating hotel failed`,
                    },
                };
            }
        });
    }
    //User side
    getHotels() {
        return __awaiter(this, void 0, void 0, function* () {
            const hotels = yield this.HotelRepository.findAllHotels();
            return {
                status: 200,
                data: {
                    success: true,
                    message: hotels,
                },
            };
        });
    }
}
exports.default = HotelUseCase;
