import mongoose, { Document, Model, Schema } from "mongoose";
// import IConversation from "../../domain/entities/conversation";

export interface IConversation extends Document {
  members: Array<string>;
}
const conversationSchema: Schema = new Schema<IConversation & Document>(
  {
    members: { type: [String] },
  },
  {
    timestamps: true,
  }
);

const ConversationModel: Model<IConversation & Document> = mongoose.model<
  IConversation & Document
>("Conversation", conversationSchema);

export default ConversationModel;
