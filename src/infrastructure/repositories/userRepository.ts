import IUser from "../../domain/entities/user";
import UserModel from "../database/userModel";
import UserRepo from "../../useCases/interfaces/userRepo";

class UserRepository implements UserRepo {
  async save(user: IUser): Promise<IUser> {
    const newUser = new UserModel(user);
    await newUser.save();
    return newUser;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ email });
    return user;
  }

  async findById(_id: string): Promise<IUser | null> {
    const user = await UserModel.findById({ _id });
    return user;
  }

  async findAllUsers(): Promise<{}[] | null> {
    const users = await UserModel.find({}).select("-password");
    return users;
  }

  async findByIdAndUpdate(
    _id: string,
    isVerified: boolean,
    isBlocked: boolean
  ): Promise<IUser | null> {
    const user = await UserModel.findByIdAndUpdate(
      _id,
      { isVerified, isBlocked },
      { new: true }
    );
    return user;
  }

  async findByIdAndUpdateProfile(
    _id: string,
    reqBody: object
  ): Promise<IUser | null> {
    const updatedUser = await UserModel.findByIdAndUpdate(_id, reqBody, {
      new: true,
    });
    return updatedUser;
  }

  async findByOneAndUpdateWishlist(
    _id: string,
    hotelId: string,
    isWishlisted:boolean,
  ): Promise<IUser|null> {
    if(isWishlisted===true){
      await UserModel.findOneAndUpdate({_id},{$pull:{wishlist:hotelId}},{new:true});
      const user = await UserModel.findById({ _id });
      console.log('Wishlist pulled from userRepository updated')
      return user;
    }else{
      await UserModel.findOneAndUpdate({_id},{$push:{wishlist:hotelId}},{new:true});
      const user = await UserModel.findById({ _id });
      console.log('Wishlist pushed from userRepository updated')
      return user;
    }
  }

  async findByIdAndUpdatePassword(
    _id: string,
    newPassword: string
  ): Promise<IUser | null> {
    const updatedUser = await UserModel.findByIdAndUpdate({_id},{$set:{password:newPassword}} , {
      new: true,
    });
    return updatedUser;
  }

  async findByIdAndUpdateWallet(_id: string,amount:number,walletHistory:any): Promise<IUser | null> {
    const updatedUser = await UserModel.findByIdAndUpdate({_id: _id},
      {
          $inc:{
              wallet: amount
          },
          $push:{
              walletHistory
          }
      })
    return updatedUser;
  }
  
}

export default UserRepository;
