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
class RoomController {
    constructor(RoomUseCase) {
        this.RoomUseCase = RoomUseCase;
    }
    //Admin Side
    addRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newRoom = yield this.RoomUseCase.addRoom(req.body);
                if (newRoom) {
                    return res.status(newRoom.status).json({
                        success: true,
                        result: Object.assign({}, newRoom.data),
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
    deleteRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roomId = req.params.roomId;
                const room = this.RoomUseCase.deleteRoom(roomId);
                return res.status(200).json({
                    success: true,
                    result: { room },
                });
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    //User side
    getRooms(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rooms = yield this.RoomUseCase.getRooms();
                res.status(rooms.status).json({
                    success: true,
                    result: Object.assign({}, rooms.data),
                });
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    updateRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roomId = req.params.roomId;
                const updatedroom = yield this.RoomUseCase.updateRoom(roomId, req.body);
                res.status(200).json({
                    success: true,
                    result: Object.assign({}, updatedroom.data),
                });
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
}
exports.default = RoomController;
