import IHotel from "../../domain/entities/hotel";
import HotelModel from "../database/hotelModel";
import HotelRepo from "../../useCases/interfaces/hotelRepo";

class HotelRepository implements HotelRepo{
  async save(hotel:IHotel) : Promise<IHotel>{
    console.log('hotelRepository',hotel)
    const newHotel = new HotelModel(hotel);
    await newHotel.save();
    return newHotel;
  }

  async findById(_id:string) : Promise<IHotel | null>{
    const hotel = await HotelModel.findOne({_id});
    return hotel;
  }

  async findAllHotels(): Promise<{}[] | null> {
    const hotels = await HotelModel.find({}).sort({_id:-1});
    return hotels;
  }
}

export default HotelRepository;