import IUser from "../domain/entities/user";
import UserRepository from "../infrastructure/repositories/userRepository";
import Encrypt from "../infrastructure/services/bcryptPassword";
import JWTToken from "../infrastructure/services/generateToken";

class UserUserCase {
  private UserRepository: UserRepository;
  private Encrypt: Encrypt;
  private JWTToken: JWTToken;

  constructor(
    UserRepository: UserRepository,
    Encrypt: Encrypt,
    JWTToken: JWTToken
  ) {
    this.UserRepository = UserRepository;
    this.Encrypt = Encrypt;
    this.JWTToken = JWTToken;
  }

  async signUp(email: string) {
    const userExists = await this.UserRepository.findByEmail(email);
  
    if (userExists) {
      if (userExists.isGoogle) {
        // If the user is blocked, return an error
        if (userExists?.isBlocked) {
          return {
            status: 400,
            data: {
              success: false,
              message: "You have been blocked by admin!",
              token: "",
            },
          };
        }
  
        // If the user is not blocked, generate a token and return success
        const userId = userExists?._id;
        if (userId) {
          const token = this.JWTToken.generateToken(
            userExists._id,
            userExists.email,
            userExists.firstName,
            userExists.lastName,
            userExists.profileImage
          );
  
          return {
            status: 200,
            data: {
              success: true,
              message: userExists,
              token,
            },
          };
        }
      } else {
        // If the user is not a Google user, return an error
        return {
          status: 400,
          data: {
            status: false,
            success: false,
            message: "User already exists!",
          },
        };
      }
    } else {
      // If the user doesn't exist, return success with a verification message
      return {
        status: 200,
        data: {
          status: true,
          success: true,
          message: "Verification OTP sent to your email",
        },
      };
    }
  }

  async verifyUser(user: IUser) {
    console.log('useCase',user);
    var token = "";
    if (user.password) {
      const hashedPassword = await this.Encrypt.generateHash(user.password);
      const newUser = { ...user, password: hashedPassword,fullName:user.firstName + user.lastName };
      console.log('newUser',newUser)
      if (user)
        token = this.JWTToken.generateToken(
          user._id,
          user.firstName,
          user.lastName,
          user.email,
          user.profileImage
        );
      await this.UserRepository.save(newUser);
      
      return {
        status: 200,
        data: {
          status: true,
          success:true,
          message: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profileImage: user.profileImage,
          },
          token,
        },
      };
    }
  }

  async login(user: IUser) {
    const userData = await this.UserRepository.findByEmail(user.email);
    let token = "";
    if (userData) {
      if (userData?.isBlocked) {
        return {
          status: 400,
          data: {
            success:false,
            message: "You have been blocked by admin!",
            token: "",
          },
        };
      }
      const passwordMatch = await this.Encrypt.compare(
        user.password,
        userData.password
      );

      if (passwordMatch) {
        const userId = userData?._id;
        if (userId)
          token = this.JWTToken.generateToken(
            userData._id,
            userData.email,
            userData.firstName,
            userData.lastName,
            userData.profileImage
          );
        return {
          status: 200,
          data: {
            success:true,
            message: userData,
            token,
          },
        };
      } else {
        console.log('109');
        return {
          status: 400,
          data: {
            success:false,
            message: "Invalid email or password!",
            token,
          },
        };
      }
    } else {
      console.log('119');
      return {
        status: 400,
        data: {
          success:false,
          message: "Invalid email or password!",
          token,
        },
      };
    }
  }

  async updateProfile(id:string ,reqBody:object){
    const updatedUser = await this.UserRepository.findByIdAndUpdateProfile(id,reqBody);
    if(updatedUser){
      console.log('updated user',updatedUser);
      return {
        status: 200,
        data: {
          success:true,
          message: updatedUser,
        },
      };
    }else{
      return {
        status: 400,
        data: {
          success:false,
          message: "Updating user profile failed!",
        },
      };
    }
    
  }
}

export default UserUserCase;
