import IHotel from "../domain/entities/hotel";
import HotelRepository from "../infrastructure/repositories/hotelRepository";

class HotelUseCase {
  private HotelRepository: HotelRepository;

  constructor(HotelRepository: HotelRepository) {
    this.HotelRepository = HotelRepository;
  }
  //Admin side
  async addHotel(hotel: IHotel) {
    if (hotel) {
      await this.HotelRepository.save({ ...hotel });
      return {
        status: 200,
        data: {
          success: true,
          message: hotel,
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

  async deleteHotel(hotelId: string) {
    const _id = await this.HotelRepository.findAndDeleteHotel(hotelId);
    return {
      status: 200,
      data: {
        success: true,
        message: _id,
      },
    };
  }

  async updateHotel(hotelId: string, reqBody: object) {
    const updatedHotel = await this.HotelRepository.findByIdAndUpdate(
      hotelId,
      reqBody
    );
    if (updatedHotel) {
      return {
        status: 200,
        data: {
          success: true,
          message: updatedHotel,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          success: false,
          message: `Updating hotel failed`,
        },
      };
    }
  }

  //User side
  async getHotels() {
    const hotels = await this.HotelRepository.findAllHotels();
    return {
      status: 200,
      data: {
        success: true,
        message: hotels,
      },
    };
  }
}

export default HotelUseCase;
