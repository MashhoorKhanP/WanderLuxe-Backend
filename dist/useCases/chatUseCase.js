"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class ChatUseCase {
    constructor(ConversationRepository, MessageRepository, UserRepository, AdminRepository) {
        (this.ConversationRepository = ConversationRepository),
            (this.MessageRepository = MessageRepository),
            (this.UserRepository = UserRepository),
            (this.AdminRepository = AdminRepository);
    }
    newConversation(members) {
        return __awaiter(this, void 0, void 0, function* () {
            const newConversation = yield this.ConversationRepository.save(members);
            if (newConversation) {
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: newConversation,
                    },
                };
            }
            else {
                return {
                    status: 400,
                    data: {
                        status: false,
                        success: false,
                        message: "Something went wrong in new Conversation!",
                    },
                };
            }
        });
    }
    checkExisting(members) {
        return __awaiter(this, void 0, void 0, function* () {
            const isExisting = yield this.ConversationRepository.findExisting(members);
            return isExisting;
        });
    }
    getConversations(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversations = yield this.ConversationRepository.findByUserId(id);
            const lastMessage = yield this.MessageRepository.getLastMessages();
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
            }
            else {
                return {
                    status: 400,
                    data: {
                        status: false,
                        success: false,
                        message: "Something went wrong in no conversations found!",
                    },
                };
            }
        });
    }
    addMessage(reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversations = yield this.ConversationRepository.findByUserId(reqBody.sender);
            const receiverId = conversations[0].members.find((id) => id !== reqBody.sender);
            //Notification code here
            const message = yield this.MessageRepository.save(reqBody);
            if (message) {
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: message,
                    },
                };
            }
            else {
                return {
                    status: 400,
                    data: {
                        status: false,
                        success: false,
                        message: "Something went wrong in add message!",
                    },
                };
            }
        });
    }
    getMessages(convId) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield this.MessageRepository.findById(convId);
            if (messages) {
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: messages,
                    },
                };
            }
            else {
                return {
                    status: 400,
                    data: {
                        status: false,
                        success: false,
                        message: "Something went wrong in No message!",
                    },
                };
            }
        });
    }
}
exports.default = ChatUseCase;
