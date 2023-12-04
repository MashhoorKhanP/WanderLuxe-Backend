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

  async findAndDeleteHotels(hotelId: string): Promise<string | null> {
    const deletedHotel = await HotelModel.findByIdAndDelete(hotelId);
    // Check if the hotel was deleted
    if (deletedHotel) {
      // Access the _id property of the deleted document
      const { _id } = deletedHotel;
      return _id.toString(); // Assuming _id is an ObjectId, convert it to a string
    }
    // If no hotel was deleted, return null
    return null;
  }

  async findByIdAndUpdate(_id: string,reqBody:object): Promise<IHotel | null> {
    const hotel = await HotelModel.findByIdAndUpdate(_id,reqBody,{ new: true });
    return hotel;
  }
}

export default HotelRepository;