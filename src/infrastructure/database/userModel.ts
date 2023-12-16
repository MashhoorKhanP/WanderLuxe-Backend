import mongoose, { Document, Model, Schema } from "mongoose";
import IUser from "../../domain/entities/user";

const userSchema: Schema = new Schema<IUser & Document>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String },
    profileImage: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isGoogle: { type: Boolean, default: false },
    wishlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel'
    }],
    wallet: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const UserModel: Model<IUser & Document> = mongoose.model<IUser & Document>(
  "User",
  userSchema
);

export default UserModel;
