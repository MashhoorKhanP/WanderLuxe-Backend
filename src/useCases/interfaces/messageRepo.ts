import { IMessage } from "../../infrastructure/database/messageModel";

interface MessageRepo{
  save(data:any):Promise<IMessage>;
  findById(id:string): Promise<any>;
  getLastMessages():Promise<any>;
}

export default MessageRepo;