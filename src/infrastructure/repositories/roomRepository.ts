import IUser from "../../domain/entities/user";
import RoomModel from '../database/roomModel';
import RoomRepo from "../../useCases/interfaces/roomRepo";
import IRoom from "../../domain/entities/room";


class RoomRepository implements RoomRepo {
  async save(room: IRoom): Promise<IRoom> {
    console.log("roomRepository",room);
    const newRoom = new RoomModel(room);
    await newRoom.save();
    return newRoom;
  }

  async findAllRooms(): Promise<{}[] | null> {
    const rooms = await RoomModel.find({}).sort({ _id: -1 });
    return rooms;
  }

  // async findById(_id: string): Promise<IHotel | null> {
  //   const hotel = await HotelModel.findOne({ _id });
  //   return hotel;
  // }

  async findAndDeleteRoom(roomId: string): Promise<string | null> {
    const deletedRoom = await RoomModel.findByIdAndDelete(roomId);
    // Check if the hotel was deleted
    if (deletedRoom) {
      // Access the _id property of the deleted document
      const { _id } = deletedRoom;
      return _id.toString(); // Assuming _id is an ObjectId, convert it to a string
    }
    // If no hotel was deleted, return null
    return null;
  }

  async findByIdAndUpdate(
    _id: string,
    reqBody: object
  ): Promise<IRoom | null> {
    const room = await RoomModel.findByIdAndUpdate(_id, reqBody, {
      new: true,
    });
    return room;
  }

  async findByIdAndUpdateRoomsCount(_id: string, count: number): Promise<IRoom | null> {
    console.log('count from roomRepository: ',count);
    const room = await RoomModel.findByIdAndUpdate(_id,{$inc:{roomsCount: count}},
    {new:true})
    return room;
  }

  async findByIdAndIncreaseRoomsCount(_id: string, count: number): Promise<IRoom | null> {
    const room = await RoomModel.findByIdAndUpdate(_id,{$inc:{roomsCount: count}},
    {new:true})
    return room;
  }

  async findByIdAndUpdateRoomStatus(_id: string, status: string): Promise<IRoom | null> {
    console.log('roomId from BookingRepository: ', _id);
    const room = await RoomModel.findByIdAndUpdate(_id,{ status: status },
    { new: true })
    return room;
  }
}

export default RoomRepository;