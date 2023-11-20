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
      return {
        status: 400,
        data: {
          status: false,
          success:false,
          message: "User already exists!",
        },
      };
    }
    return {
      status: 200,
      data: {
        status: true,
        success:true,
        message: "Verification OTP sent to your email",
      },
    };
  }

  async verifyUser(user: IUser) {
    console.log('useCase',user);
    let token = "";
    if (user.password) {
      const hashedPassword = await this.Encrypt.generateHash(user.password);
      const newUser = { ...user, password: hashedPassword };
      console.log('newUser',newUser)
      if (user._id)
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
          message: "User registered successfully",
          result: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profileImage: user.profileImage,
          },
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
}

export default UserUserCase;
