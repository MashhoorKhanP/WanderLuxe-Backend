import IRoom from "../domain/entities/room";
import RoomRepository from "../infrastructure/repositories/roomRepository";

class RoomUseCase {
  private RoomRepository: RoomRepository;

  constructor(RoomRepository: RoomRepository) {
    this.RoomRepository = RoomRepository;
  }

  async addRoom(room: IRoom) {
    if (room) {
      await this.RoomRepository.save({ ...room });
      return {
        status: 200,
        data: {
          success: true,
          message: room,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: false,
          success: false,
          message: "Something went wrong in adding the hotel!",
        },
      };
    }
  }

  async deleteRoom(roomId: string) {
    const _id = await this.RoomRepository.findAndDeleteRoom(roomId);
    return {
      status: 200,
      data: {
        success: true,
        message: _id,
      },
    };
  }

  async updateRoom(roomId: string, reqBody: object) {
    const updatedRoom = await this.RoomRepository.findByIdAndUpdate(
      roomId,
      reqBody
    );
    if (updatedRoom) {
      return {
        status: 200,
        data: {
          success: true,
          message: updatedRoom,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          success: false,
          message: `Updating room failed`,
        },
      };
    }
  }

  //User side
  async getRooms() {
    const rooms = await this.RoomRepository.findAllRooms();
    return {
      status: 200,
      data: {
        success: true,
        message: rooms,
      },
    };
  }
}

export default RoomUseCase;
