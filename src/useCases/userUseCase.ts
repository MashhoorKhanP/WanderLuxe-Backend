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
          message: "User already exists!",
        },
      };
    }
    return {
      status: 200,
      data: {
        status: true,
        message: "Verification OTP sent to your email",
      },
    };
  }

  async verifyUser(user: IUser) {
    console.log(user)
    const hashedPassword = await this.Encrypt.generateHash(user.password);
    const newUser = { ...user, password: hashedPassword };
    await this.UserRepository.save(newUser);
    return {
      status: 200,
      data: { status: true, message: "User registered successfully" },
    };
  }
}

export default UserUserCase;
