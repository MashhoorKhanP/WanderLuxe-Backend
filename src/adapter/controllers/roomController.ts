import { Request,Response } from "express";
import RoomUseCase from "../../useCases/roomUseCase";

class RoomController {
  private RoomUseCase:RoomUseCase;

  constructor(RoomUseCase:RoomUseCase){
    this.RoomUseCase = RoomUseCase;
  }
  //Admin Side
  async addRoom(req: Request, res: Response) {
    try {
      const newRoom = await this.RoomUseCase.addRoom(req.body);
      console.log("newRoom", newRoom);
      if (newRoom) {
        return res.status(newRoom.status).json({
          success: true,
          result: { ...newRoom.data },
        });
      } else {
        res.status(400).json({ success: false, result: {} });
      }
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  async deleteRoom(req: Request, res: Response) {
    try {
      const roomId = req.params.roomId;
      console.log('roomId',roomId);
      const room = this.RoomUseCase.deleteRoom(roomId);
      return res.status(200).json({
        success: true,
        result: { room },
      });
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  //User side
  async getRooms(req: Request, res: Response) {
    try {
      const rooms = await this.RoomUseCase.getRooms();
      res.status(rooms.status).json({
        success: true,
        result: { ...rooms.data },
      });
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  async updateRoom(req: Request, res: Response) {
    try {
      const roomId = req.params.roomId;
      const updatedroom = await this.RoomUseCase.updateRoom(
        roomId,
        req.body
      );
      res.status(200).json({
        success: true,
        result: { ...updatedroom.data },
      });
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }
  
}

export default RoomController;