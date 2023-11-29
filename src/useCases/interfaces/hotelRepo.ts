import IHotel from "../../domain/entities/hotel";

interface HotelRepo{
  save(hotel:IHotel) : Promise<IHotel>;
  findById(_id:string):Promise<IHotel | null>;
  findAllHotels():Promise<{}[] | null>;
}

export default HotelRepo;