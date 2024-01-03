import IUser from "../../domain/entities/user";

interface UserRepo {
  save(user: IUser): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findById(_id: string): Promise<IUser | null>;
  findAllUsers(): Promise<{}[] | null>;
  findByIdAndUpdateWallet(_id: string,amount:number,walletHistory:any): Promise<IUser | null>;
}

export default UserRepo;
