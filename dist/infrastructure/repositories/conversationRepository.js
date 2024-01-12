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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const conversationModel_1 = __importDefault(require("../database/conversationModel"));
class ConversationRepository {
    save(membersArray) {
        return __awaiter(this, void 0, void 0, function* () {
            const newConversation = new conversationModel_1.default({ members: membersArray });
            const save = yield newConversation.save();
            return save;
        });
    }
    findByUserId(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversations = yield conversationModel_1.default.find({
                members: { $in: [_id] },
            });
            return conversations;
        });
    }
    findExisting(members) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversations = yield conversationModel_1.default.find({
                members: { $all: [members[0], members[1]] },
            });
            return conversations;
        });
    }
}
exports.default = ConversationRepository;
