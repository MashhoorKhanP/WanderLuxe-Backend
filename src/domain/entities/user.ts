interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  password?:string,
  profileImage: string;
  isVerified?: boolean;
  isBlocked?: boolean;
  wallet?:number | null;
  wishlist?: {}[];
  isGoogle?:boolean
}

export default IUser;