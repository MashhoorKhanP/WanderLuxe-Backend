import IUser from "../../domain/entities/user";

interface UserRepo{
  save(user:IUser): Promise<IUser>;
  findByEmail(email:string) : Promise<IUser|null>;
  findById(_id:string) : Promise<IUser | null>;
  findAllUsers(): Promise<{}[] | null>;
}

export default UserRepo;