import IRoom from "../../domain/entities/room";

interface RoomRepo{
  save(room:IRoom) :Promise<IRoom>;
  // findById(_id:string):Promise<IRoom | null>;
  // findAllRooms():Promise<{}[] | null>;
}

export default RoomRepo;