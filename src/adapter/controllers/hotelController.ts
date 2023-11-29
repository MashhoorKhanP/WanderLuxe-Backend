import { Request,Response } from "express";
import HotelUseCase from "../../useCases/hotelUseCase";

class HotelController {
  private HotelUseCase : HotelUseCase;

  constructor(HotelUseCase : HotelUseCase){
    this.HotelUseCase = HotelUseCase;
  }

  async addHotel(req:Request, res: Response){
    try{
      const newHotel = await this.HotelUseCase.addHotel(req.body);
      console.log('newHotel',newHotel);
      if(newHotel){
        return res.status(newHotel.status).json({
          success:true,
          result:{...newHotel.data}
        })
      } else {
        res.status(400).json({ success: false, result: {} });
      }
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }
}

export default HotelController;