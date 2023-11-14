import IUser from "../../domain/entities/user";
import UserModel from "../database/userModel";
import UserRepo from "../../useCases/interfaces/userRepo";

class UserRepository implements UserRepo{
  async save(user: IUser): Promise<IUser>{
    const newUser = new UserModel(user);
    await newUser.save();
    return newUser;
  }

  async findByEmail(email:string): Promise<IUser | null>{
    const user = await UserModel.findOne({email});
    return user;
  }

  async findById(_id: string): Promise<IUser | null> {
      const user = await UserModel.findById({_id});
      return user;
  }

  async findAllUsers(): Promise<{}[] | null> {
      const users = await UserModel.find({}).select('-password');
      return users;
  }
}

export default UserRepository;