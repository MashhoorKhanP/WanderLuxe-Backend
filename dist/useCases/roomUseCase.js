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
class RoomUseCase {
    constructor(RoomRepository) {
        this.RoomRepository = RoomRepository;
    }
    addRoom(room) {
        return __awaiter(this, void 0, void 0, function* () {
            if (room) {
                yield this.RoomRepository.save(Object.assign({}, room));
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: room,
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
    deleteRoom(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = yield this.RoomRepository.findAndDeleteRoom(roomId);
            return {
                status: 200,
                data: {
                    success: true,
                    message: _id,
                },
            };
        });
    }
    updateRoom(roomId, reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedRoom = yield this.RoomRepository.findByIdAndUpdate(roomId, reqBody);
            if (updatedRoom) {
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: updatedRoom,
                    },
                };
            }
            else {
                return {
                    status: 400,
                    data: {
                        success: false,
                        message: `Updating room failed`,
                    },
                };
            }
        });
    }
    //User side
    getRooms() {
        return __awaiter(this, void 0, void 0, function* () {
            const rooms = yield this.RoomRepository.findAllRooms();
            return {
                status: 200,
                data: {
                    success: true,
                    message: rooms,
                },
            };
        });
    }
}
exports.default = RoomUseCase;
