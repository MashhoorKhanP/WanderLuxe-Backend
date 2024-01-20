import express from "express";
import cors from "cors";
import http from "http";
import userRoute from "../routes/userRoute";
import adminRoute from "../routes/adminRoute";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { SocketManager } from "../services/socket";
import UserRepository from "../repositories/userRepository";
dotenv.config();

export const createServer = () => {
  try {
    const app = express();

    app.use(
      cors({
        origin: '*', // Allow requests from CLIENT_URL
        methods: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        allowedHeaders: "X-Requested-With, Content-Type, Authorization",
        credentials: true,
      })
    );
    app.options("*", cors());

    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, "../public")));
    app.use(cookieParser());

    const httpServer = http.createServer(app);
    const repository = new UserRepository();
    const socket = new SocketManager(httpServer, repository);

    app.use("/api/user", userRoute);
    app.use("/api/admin", adminRoute);

    // // Handle 404 Not Found
    app.use((req, res) =>
      res.status(404).json({ success: false, message: "Not Found" })
    );

    // return app;
    return httpServer;
  } catch (error) {
    const err: Error = error as Error;
    console.log(err.message);
  }
};
