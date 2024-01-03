import mongoose, { Document,Model, Schema } from "mongoose";
// import IMessage from "../../domain/entities/message";

export interface IMessage extends Document {
  conversationId:string,
  sender:string,
  text:string,
  image:string
}

const messageSchema: Schema = new Schema<IMessage & Document>(
  {
    conversationId:{type: String},
    sender:{type: String},
    text: {type: String},
    image:{type:String,default:''}
  },
  {
    timestamps: true,
  }
);

const  MessageModel: Model<IMessage & Document> = mongoose.model<IMessage & Document>(
  "Message",
  messageSchema
);

export default MessageModel;
