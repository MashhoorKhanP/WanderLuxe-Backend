interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  password: string;
  profileImage: string;
  isVerified?: boolean;
  isBlocked?: boolean;
  wallet?: number | any;
  walletHistory?: [
    {
      transactionDate: Date;
      transactionDetails: string;
      transactionType: string;
      transactionAmount: number;
      currentBalance: number;
      transactionId: string;
    }
  ];
  wishlist?: [];
  isGoogle?: boolean;
}

export default IUser;
