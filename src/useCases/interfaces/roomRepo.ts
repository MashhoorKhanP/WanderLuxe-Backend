import IRoom from "../../domain/entities/room";

interface RoomRepo{
  save(room:IRoom) :Promise<IRoom>;
  // findById(_id:string):Promise<IRoom | null>;
  findAllRooms():Promise<{}[] | null>;
  findAndDeleteRoom(roomId: string): Promise<string | null>
  findByIdAndUpdate(
    _id: string,
    reqBody: object
  ): Promise<IRoom | null>;
  
}

export default RoomRepo;