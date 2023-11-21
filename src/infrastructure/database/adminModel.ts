import mongoose, { Model, Schema } from "mongoose";
import IAdmin from "../../domain/entities/admin";

const adminSchema :Schema = new Schema<IAdmin & Document>({
  firstName:{type: String ,required:true},
  lastName:{type:String,required:true},
  email:{type:String,required:true,unique:true},
  password:{type:String,required:true},
  profileImage:{type:String,default:''}
},{
  timestamps:true
});

const AdminModel : Model<IAdmin & Document > = mongoose.model<IAdmin & Document > ('Admin',adminSchema);

export default AdminModel;