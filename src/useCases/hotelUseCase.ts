import IHotel from "../domain/entities/hotel";
import HotelRepository from "../infrastructure/repositories/hotelRepository";

class HotelUseCase {
  private HotelRepository: HotelRepository;

  constructor(HotelRepository: HotelRepository) {
    this.HotelRepository = HotelRepository;
  }

  async addHotel(hotel: IHotel) {
      console.log("hotelUseCase", { ...hotel });
      if (hotel) {
        await this.HotelRepository.save({ ...hotel });
        console.log("Hotel added successfully");
        return {
          status: 200,
          data: {
            success: true,
            message: hotel,
          },
        };
      }else{
        return {
          status:400,
          data:{
            status:false,
            success:false,
            message:'Something went wrong in adding the hotel!'
          }
        }
      }

  }
}

export default HotelUseCase;
