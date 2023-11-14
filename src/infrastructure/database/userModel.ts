import mongoose, { Document, Model, Schema } from "mongoose";
import IUser from "../../domain/entities/user";


const userSchema: Schema = new Schema<IUser & Document>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true,unique:true },
  password:{type: String, required: true},
  mobile: { type: Number,required:true,unique:true},
  profileImage: { type: String, default:'https://asset.cloudinary.com/dmce7p7q5/2a8d7d609419d00a2205241f7b3b5499'},
  isVerified: { type: Boolean,default:false },
  isBlocked: { type: Boolean,default:false },
  isGoogle:{type:Boolean,default:false},
  wishlist:[{
  }],
  wallet:{type:Number,default:0},

},{
  timestamps:true
});

const UserModel : Model<IUser & Document> = mongoose.model<IUser & Document>('User',userSchema);

export default UserModel;