import mongoose, {Document, Model, Schema } from "mongoose";
import IBooking from "../../domain/entities/booking";

const bookingSchema: Schema = new Schema<IBooking & Document>(
  {
    firstName :{type:String,require:true},
    lastName :{type:String,require:true},
    email :{type:String,require:true},
    mobile :{type:String,require:true},
    roomId :{type:String,require:true},
    hotelId:{type:String,require:true},
    userId :{type:String,require:true},
    roomType:{type:String,require:true},
    hotelName:{type:String,require:true},
    roomImage:{type:String,require:true},
    totalRoomsCount:{type:Number,require:true},
    checkInDate:{type:String,require:true},
    checkOutDate:{type:String,require:true},
    checkInTime:{type:String,require:true},
    checkOutTime:{type:String,require:true},
    appliedCouponId:{type:String,require:true},
    couponDiscount:{type:Number},
    numberOfNights:{type:Number,require:true},
    totalAmount:{type:Number,require:true},
    adults:{type:Number,require:true},
    children:{type:Number,require:true},
    status:{type:String,require:true,default:'Confirmed'},
    transactionId:{type:String},
    receiptUrl:{type:String},
    paymentMethod:{type:String}
  },
  {
    timestamps: true,
  }
);


const BookingModel: Model<IBooking & Document> = mongoose.model<IBooking & Document>(
  "Booking",
  bookingSchema
);

export default BookingModel;
