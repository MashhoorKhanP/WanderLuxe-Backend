interface IHotel {
  _id?: string;
  longitude: number;
  latitude: number;
  hotelName: string;
  location: string;
  distanceFromCityCenter: number;
  email: string;
  mobile: string;
  minimumRent: number;
  description: string;
  parkingPrice?: number;
  images: string[];
  dropImage: string;
  appliedOffer:string;
  
}

export default IHotel;
