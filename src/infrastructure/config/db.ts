import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (MONGO_URI) {
      const conn = await mongoose.connect(MONGO_URI);
      console.log(`MongoDB connected: ${conn.connection.host}`);
    }
  } catch (error) {
    const err: Error = error as Error;
    console.log(`Error is ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
