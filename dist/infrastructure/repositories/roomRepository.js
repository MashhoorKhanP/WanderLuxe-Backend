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
const roomModel_1 = __importDefault(require("../database/roomModel"));
class RoomRepository {
    save(room) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("roomRepository", room);
            const newRoom = new roomModel_1.default(room);
            yield newRoom.save();
            return newRoom;
        });
    }
    findAllRooms() {
        return __awaiter(this, void 0, void 0, function* () {
            const rooms = yield roomModel_1.default.find({}).sort({ _id: -1 });
            return rooms;
        });
    }
    findAndDeleteRoom(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedRoom = yield roomModel_1.default.findByIdAndDelete(roomId);
            // Check if the hotel was deleted
            if (deletedRoom) {
                // Access the _id property of the deleted document
                const { _id } = deletedRoom;
                return _id.toString(); // Assuming _id is an ObjectId, convert it to a string
            }
            // If no hotel was deleted, return null
            return null;
        });
    }
    findByIdAndUpdate(_id, reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield roomModel_1.default.findByIdAndUpdate(_id, reqBody, {
                new: true,
            });
            return room;
        });
    }
    findByIdAndUpdateRoomsCount(_id, count) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("count from roomRepository: ", count);
            const room = yield roomModel_1.default.findByIdAndUpdate(_id, { $inc: { roomsCount: count } }, { new: true });
            return room;
        });
    }
    findByIdAndIncreaseRoomsCount(_id, count) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield roomModel_1.default.findByIdAndUpdate(_id, { $inc: { roomsCount: count } }, { new: true });
            return room;
        });
    }
    findByIdAndUpdateRoomStatus(_id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("roomId from BookingRepository: ", _id);
            const room = yield roomModel_1.default.findByIdAndUpdate(_id, { status: status }, { new: true });
            return room;
        });
    }
}
exports.default = RoomRepository;
