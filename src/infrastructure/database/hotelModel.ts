import mongoose, {Document, Model, Schema} from "mongoose";
import IHotel from "../../domain/entities/hotel";

const hotelSchema:Schema = new Schema<IHotel & Document>(
  {
    longitude:{type:Number,require:true},
    latitude:{type:Number,require:true},
    hotelName:{type:String, required:true},
    location:{type:String, required:true},
    distanceFromCityCenter:{type:Number, required:true},
    email:{type:String, required:true},
    minimumRent:{type:Number, required:true},
    description:{type:String,required:true},
    parkingPrice:{type:Number,default:0},
    images:{type:[String]}

  },
  {timestamps:true}
)

const HotelModel : Model<IHotel & Document> = mongoose.model <IHotel & Document > (
  "Hotel",
  hotelSchema
)

export default HotelModel;