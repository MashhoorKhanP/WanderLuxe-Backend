import IAdmin from "../domain/entities/admin";
import AdminRepository from "../infrastructure/repositories/adminRepository";
import UserRepository from "../infrastructure/repositories/userRepository";
import Encrypt from "../infrastructure/services/bcryptPassword";
import JWTToken from "../infrastructure/services/generateToken";

type UserType = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  password: string;
  profileImage?: string;
  isVerified?: boolean;
  isBlocked?: boolean;
  isGoogle?: boolean;
  createdAt: string | Date;
};

class AdminUseCase {
  private AdminRepository: AdminRepository;
  private UserRepository: UserRepository;
  private Encrypt: Encrypt;
  private JWTToken: JWTToken;

  constructor(
    AdminRepository: AdminRepository,
    UserRepository: UserRepository,
    Encrypt: Encrypt,
    JWTToken: JWTToken
  ) {
    this.AdminRepository = AdminRepository;
    this.UserRepository = UserRepository;
    this.Encrypt = Encrypt;
    this.JWTToken = JWTToken;
  }

  async login(admin: IAdmin) {
    const adminData = await this.AdminRepository.findByEmail(admin.email);
    if (adminData) {
      const passwordMatch = await this.Encrypt.compare(
        admin.password,
        adminData.password
      );
      if (passwordMatch) {
        const token = this.JWTToken.generateToken(
          adminData._id,
          adminData.email,
          adminData.firstName,
          adminData.profileImage,
          adminData.lastName
        );
        return {
          status: 200,
          data: {
            success: true,
            message: adminData,
            token,
          },
        };
      } else {
        return {
          status: 400,
          data: {
            success: false,
            message: "Invalid email or password!",
            token: null,
          },
        };
      }
    } else {
      return {
        status: 400,
        data: {
          success: false,
          message: "Invalid email or password!",
          token: null,
        },
      };
    }
  }

  async getUsers() {
    const usersList = await this.UserRepository.findAllUsers();
    return {
      status: 200,
      data: {
        success: true,
        message: usersList,
      },
    };
  }

  async updateUser(userId: string, isVerified: boolean, isBlocked: boolean) {
    const updateUser = await this.UserRepository.findByIdAndUpdate(
      userId,
      isVerified,
      isBlocked
    );
    console.log("updatedUser from adminUseCase", updateUser);
    if (updateUser) {
      return {
        status: 200,
        data: {
          success: true,
          message: updateUser._id,
        },
      };
    } else {
      return {
        data: {
          success: false,
          message: "User not found",
        },
      };
    }
  }
}

export default AdminUseCase;
