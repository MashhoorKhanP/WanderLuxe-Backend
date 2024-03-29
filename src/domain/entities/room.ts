interface IRoom {
  _id?: string;
  roomType: string;
  hotelName: string;
  hotelId: string;
  amenities: string[] | any;
  price: number;
  discountPrice: number;
  roomsCount: number;
  maxPeople: number;
  description: string;
  parkingPrice: number;
  images?: string[];
  status: string;
}

export default IRoom;
