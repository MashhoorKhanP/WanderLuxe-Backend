interface IConversation {
  members: Array<string>;
}

interface ConversationRepo {
  save(conversation: IConversation): Promise<IConversation>;
  findByUserId(_id: string): Promise<IConversation | null>;
  findExisting(members: Array<string>): Promise<IConversation | null>;
}

export default ConversationRepo;
