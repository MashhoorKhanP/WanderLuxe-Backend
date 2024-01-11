import MessageRepo from "../../useCases/interfaces/messageRepo";
import MessageModel, { IMessage } from "../database/messageModel";

class MessageRepository implements MessageRepo {
  async save(data: any): Promise<IMessage> {
    const message = new MessageModel(data);
    const save = await message.save();
    return save;
  }

  async findById(id: string): Promise<any> {
    const messages = await MessageModel.find({ conversationId: id });
    return messages;
  }

  async getLastMessages(): Promise<any> {
    const lastMessages = await MessageModel.aggregate([
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$conversationId",
          lastMessage: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$lastMessage" },
      },
    ]);
    return lastMessages;
  }
}

export default MessageRepository;
