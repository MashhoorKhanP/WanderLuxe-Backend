import mongoose, { Document, Model, Schema } from "mongoose";
import IRoom from "../../domain/entities/room";

const roomSchema: Schema = new Schema<IRoom & Document>(
  {
    roomType: { type: String, required: true },
    hotelName: { type: String, required: true },
    hotelId:{ type: String, required: true},
    amenities: { type: Array },
    price: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    roomsCount: { type: Number, required: true },
    maxPeople: { type: Number, required: true },
    description: { type: String, required: true },
    images: { type: Array },
    status: { type: String, default:'Available',required:true },
  },
  { timestamps: true }
);

const RoomModel : Model<IRoom & Document> = mongoose.model <IRoom & Document > (
  "Room",
  roomSchema
)

export default RoomModel;