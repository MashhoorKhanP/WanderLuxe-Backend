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
exports.SocketManager = void 0;
const socket_io_1 = require("socket.io");
class SocketManager {
    constructor(httpServer, userRepository) {
        this.users = [];
        this.handleConnection = (socket) => {
            //When connect
            socket.on("addUser", (userId) => {
                console.log("a user connected");
                this.addUser(userId, socket.id);
                this.io.to(socket.id).emit("welcome", `Hello this from socket ${userId}`);
                this.io.emit("getUser", this.users);
                console.log(this.users);
            });
            socket.on("isBlocked", ({ userId }) => __awaiter(this, void 0, void 0, function* () {
                let blockedUser = this.getUser(userId);
                let user = yield this.userRespository.findById(userId);
                if (user && user._id && blockedUser) {
                    this.io
                        .to(blockedUser.socketId)
                        .emit("responseIsBlocked", { isBlocked: user.isBlocked });
                }
            }));
            //Send and get message
            socket.on("sendMessage", ({ senderId, receiverId, text }) => {
                const user = this.getUser(receiverId);
                // console.log(
                //   "user from socket",
                //   "sender=",
                //   senderId,
                //   "reciever=",
                //   receiverId,
                //   "text=",
                //   text,
                //   "socketId=",
                //   user,
                //   user?.socketId
                // );
                this.io.to(user === null || user === void 0 ? void 0 : user.socketId).emit("getMessage", {
                    senderId,
                    text,
                });
            });
            //When disconnect
            socket.on("disconnect", () => {
                console.log("A user disconnected!");
                this.removeUser(socket.id);
                this.io.emit("getUser", this.users);
            });
        };
        this.httpServer = httpServer;
        this.userRespository = userRepository;
        this.io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: '*',
            },
        });
        this.io.on("connection", this.handleConnection);
    }
    addUser(userId, socketId) {
        if (!this.users.some((user) => user.userId === userId)) {
            this.users.push({ userId, socketId });
        }
    }
    removeUser(socketId) {
        this.users = this.users.filter((user) => user.socketId !== socketId);
    }
    getUser(userId) {
        return this.users.find((user) => user.userId === userId);
    }
}
exports.SocketManager = SocketManager;
