import { createServer } from "./infrastructure/config/app";
import connectDB from "./infrastructure/config/db";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app:any = createServer();
const port = process.env.PORT || 6000;
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Allow requests from CLIENT_URL
    // methods: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    // allowedHeaders: "X-Requested-With, Content-Type, Authorization",
    credentials: true,
  })
);
app.options("*", cors());

connectDB().then(() => {
  app?.listen(port, () => console.log(`Example app listening on port ${port}`));
});
