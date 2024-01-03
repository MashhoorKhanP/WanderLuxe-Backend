// import IConversation from "../../domain/entities/conversation";
import ConversationRepo from "../../useCases/interfaces/conversationRepo";
import ConversationModel, { IConversation } from "../database/conversationModel";

class ConversationRepository implements ConversationRepo {
  
  async save(membersArray: IConversation): Promise<IConversation> {
      const newConversation = new ConversationModel({members:membersArray});
      const save = await newConversation.save();
      return save;
  }

  async findByUserId(_id: string): Promise<any> {
      const conversations = await ConversationModel.find({members:{$in:[_id]}})
      return conversations;
  }

  async findExisting(members: string[]): Promise<any> {
    const conversations = await ConversationModel.find({members:{$all:[members[0],members[1]]}})
    return conversations;
      
  }


}

export default ConversationRepository;
