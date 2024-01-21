import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import UserRepository from "../repositories/userRepository";

interface User {
  userId: string;
  socketId: string;
}

export class SocketManager {
  private httpServer: HttpServer;
  public io: Server;
  private userRespository: UserRepository;
  private users: User[] = [];

  constructor(httpServer: HttpServer, userRepository: UserRepository) {
    this.httpServer = httpServer;
    this.userRespository = userRepository;
    this.io = new Server(httpServer, {
      cors: {
        origin: '*',
      },
    });

    this.io.on("connection", this.handleConnection);
  }

  private handleConnection = (socket: Socket): void => {
    //When connect
    socket.on("addUser", (userId: string) => {
      console.log("a user connected");
      this.addUser(userId, socket.id);
      this.io.to(socket.id).emit("welcome", `Hello this from socket ${userId}`);
      this.io.emit("getUser", this.users);
      console.log(this.users);
    });

    socket.on("isBlocked", async ({ userId }: { userId: string }) => {
      let blockedUser = this.getUser(userId);
      let user = await this.userRespository.findById(userId);
      if (user && user._id && blockedUser) {
        this.io
          .to(blockedUser.socketId)
          .emit("responseIsBlocked", { isBlocked: user.isBlocked });
      }
    });

    //Send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user: any = this.getUser(receiverId);
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
      this.io.to(user?.socketId).emit("getMessage", {
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

  private addUser(userId: string, socketId: string): void {
    if (!this.users.some((user) => user.userId === userId)) {
      this.users.push({ userId, socketId });
    }
  }

  private removeUser(socketId: string): void {
    this.users = this.users.filter((user) => user.socketId !== socketId);
  }

  private getUser(userId: string): User | undefined {
    return this.users.find((user) => user.userId === userId);
  }
}
