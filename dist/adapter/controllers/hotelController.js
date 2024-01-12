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
class HotelController {
    constructor(HotelUseCase) {
        this.HotelUseCase = HotelUseCase;
    }
    //Admin Side
    addHotel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newHotel = yield this.HotelUseCase.addHotel(req.body);
                if (newHotel) {
                    return res.status(newHotel.status).json({
                        success: true,
                        result: Object.assign({}, newHotel.data),
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
    deleteHotel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hotelId = req.params.hotelId;
                const hotel = this.HotelUseCase.deleteHotel(hotelId);
                return res.status(200).json({
                    success: true,
                    result: { hotel },
                });
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    updateHotel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hotelId = req.params.hotelId;
                const updatedHotel = yield this.HotelUseCase.updateHotel(hotelId, req.body);
                res.status(200).json({
                    success: true,
                    result: Object.assign({}, updatedHotel.data),
                });
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    //User side
    getHotels(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hotels = yield this.HotelUseCase.getHotels();
                res.status(hotels.status).json({
                    success: true,
                    result: Object.assign({}, hotels.data),
                });
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
}
exports.default = HotelController;
