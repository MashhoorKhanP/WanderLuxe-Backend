import { IConversation } from "../infrastructure/database/conversationModel";
import AdminRepository from "../infrastructure/repositories/adminRepository";
import ConversationRepository from "../infrastructure/repositories/conversationRepository";
import MessageRepository from "../infrastructure/repositories/messageRepository";
import UserRepository from "../infrastructure/repositories/userRepository";

class ChatUseCase {
  private ConversationRepository: ConversationRepository;
  private MessageRepository: MessageRepository;
  private UserRepository: UserRepository;
  private AdminRepository: AdminRepository;
  constructor(
    ConversationRepository: ConversationRepository,
    MessageRepository: MessageRepository,
    UserRepository: UserRepository,
    AdminRepository: AdminRepository
  ) {
    (this.ConversationRepository = ConversationRepository),
      (this.MessageRepository = MessageRepository),
      (this.UserRepository = UserRepository),
      (this.AdminRepository = AdminRepository);
  }

  async newConversation(members: IConversation) {
    const newConversation = await this.ConversationRepository.save(members);
    if (newConversation) {
      return {
        status: 200,
        data: {
          success: true,
          message: newConversation,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: false,
          success: false,
          message: "Something went wrong in new Conversation!",
        },
      };
    }
  }
  async checkExisting(members: Array<string>) {
    const isExisting = await this.ConversationRepository.findExisting(members);

    return isExisting;
  }

  async getConversations(id: string) {
    const conversations = await this.ConversationRepository.findByUserId(id);

    const lastMessage = await this.MessageRepository.getLastMessages();

    const data = {
      conv: conversations,
      lastMessages: lastMessage,
    };

    if (conversations) {
      return {
        status: 200,
        data: {
          success: true,
          message: data,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: false,
          success: false,
          message: "Something went wrong in no conversations found!",
        },
      };
    }
  }

  async addMessage(reqBody: {
    conversationId: string;
    sender: string;
    text: string;
  }) {
    const conversations = await this.ConversationRepository.findByUserId(
      reqBody.sender
    );

    const receiverId = conversations[0].members.find(
      (id: string) => id !== reqBody.sender
    );

    //Notification code here

    const message = await this.MessageRepository.save(reqBody);

    if (message) {
      return {
        status: 200,
        data: {
          success: true,
          message: message,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: false,
          success: false,
          message: "Something went wrong in add message!",
        },
      };
    }
  }

  async getMessages(convId: string) {
    const messages = await this.MessageRepository.findById(convId);

    if (messages) {
      return {
        status: 200,
        data: {
          success: true,
          message: messages,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: false,
          success: false,
          message: "Something went wrong in No message!",
        },
      };
    }
  }
}

export default ChatUseCase;
