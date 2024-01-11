import IHotel from "../../domain/entities/hotel";

interface HotelRepo {
  save(hotel: IHotel): Promise<IHotel>;
  findById(_id: string): Promise<IHotel | null>;
  findAllHotels(): Promise<{}[] | null>;
  findAndDeleteHotel(hotelId: string): Promise<string | null>;
  findByIdAndUpdate(_id: string, reqBody: object): Promise<IHotel | null>;
}

export default HotelRepo;
