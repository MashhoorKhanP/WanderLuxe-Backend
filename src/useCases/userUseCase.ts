import { ObjectId } from "mongodb";
import IUser from "../domain/entities/user";
import UserRepository from "../infrastructure/repositories/userRepository";
import Encrypt from "../infrastructure/services/bcryptPassword";
import JWTToken from "../infrastructure/services/generateToken";
import mongoose from "mongoose";
import PaymentRepository from "../infrastructure/services/stripe";

class UserUserCase {
  private UserRepository: UserRepository;
  private Encrypt: Encrypt;
  private JWTToken: JWTToken;
  private PaymentRepository: PaymentRepository;

  constructor(
    UserRepository: UserRepository,
    Encrypt: Encrypt,
    JWTToken: JWTToken,
    PaymentRepository: PaymentRepository
  ) {
    this.UserRepository = UserRepository;
    this.Encrypt = Encrypt;
    this.JWTToken = JWTToken;
    this.PaymentRepository = PaymentRepository;
  }

  async googleSignUp(email: string) {
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
          const role = "user";
          const token = this.JWTToken.generateToken(
            userExists._id,
            userExists.email,
            userExists.firstName,
            userExists.lastName,
            userExists.profileImage,
            role
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

  async signUp(email: string, mobile: string) {
    const userExists = await this.UserRepository.findByEmail(email);
    const sameMobileExits = await this.UserRepository.findByMobile(mobile);
    if (userExists) {
      return {
        status: 400,
        data: {
          status: false,
          success: false,
          message: "User already exists!",
        },
      };
    }
    if (sameMobileExits) {
      return {
        status: 400,
        data: {
          status: false,
          success: false,
          message: "Mobile Number already exist!",
        },
      };
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
    var token = "";
    if (user.password) {
      const hashedPassword = await this.Encrypt.generateHash(user.password);
      const newUser = { ...user, password: hashedPassword };
      const role = "user";
      if (user)
        token = this.JWTToken.generateToken(
          user._id,
          user.firstName,
          user.lastName,
          user.email,
          user.profileImage,
          role
        );

      const savedUser = await this.UserRepository.save(newUser);
      const safedUserData = {
        _id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        profileImage: savedUser.profileImage,
        isVerified: savedUser.isVerified,
        isBlocked: savedUser.isBlocked,
        isGoogle: savedUser.isGoogle,
        wishlist: savedUser.wishlist,
        wallet: savedUser.wallet,
        mobile: savedUser.mobile,
        walletHistory: savedUser.walletHistory,
      };
      return {
        status: 200,
        data: {
          status: true,
          success: true,
          message: {
            ...safedUserData
          },
          token,
        },
      };
    }
  }

  async verifyForgotPasswordUser(user: any, isForgotPassword: string) {
    const userData: any = await this.verifyForgotPassword(
      user.email,
      user.newPassword
    );
    if (userData) {
      return {
        status: 200,
        data: {
          status: true,
          success: true,
          message: userData,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          success: false,
          message: "User not found, Something went wrong",
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
            success: false,
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
        const role = "user";
        if (userId)
          token = this.JWTToken.generateToken(
            userData._id,
            userData.email,
            userData.firstName,
            userData.lastName,
            userData.profileImage,
            role
          );
        const safedUserData = {
          _id: userData._id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          profileImage: userData.profileImage,
          isVerified: userData.isVerified,
          isBlocked: userData.isBlocked,
          isGoogle: userData.isGoogle,
          wishlist: userData.wishlist,
          wallet: userData.wallet,
          mobile: userData.mobile,
          walletHistory: userData.walletHistory,
        };
        return {
          status: 200,
          data: {
            success: true,
            message: safedUserData,
            token,
          },
        };
      } else {
        return {
          status: 400,
          data: {
            success: false,
            message: "Invalid email or password!",
            token,
          },
        };
      }
    } else {
      return {
        status: 400,
        data: {
          success: false,
          message: "Invalid email or password!",
          token,
        },
      };
    }
  }

  async updateProfile(id: string, reqBody: object) {
    const updatedUser = await this.UserRepository.findByIdAndUpdateProfile(
      id,
      reqBody
    );
    if (updatedUser) {
      const safedUserData = {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
        isVerified: updatedUser.isVerified,
        isBlocked: updatedUser.isBlocked,
        isGoogle: updatedUser.isGoogle,
        wishlist: updatedUser.wishlist,
        wallet: updatedUser.wallet,
        mobile: updatedUser.mobile,
        walletHistory: updatedUser.walletHistory,
      };
      return {
        status: 200,
        data: {
          success: true,
          message: safedUserData,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          success: false,
          message: "Updating user profile failed!",
        },
      };
    }
  }

  async addRemoveFromWishlist(hotelId: string, userId: string) {
    //Continue find user then update wishlist as nonstop fashion
    const user: any = await this.UserRepository.findById(userId);
    const hotelObjectId = new mongoose.Types.ObjectId(hotelId);
    const hotelExist = user.wishlist.some((data: any) =>
      data.equals(hotelObjectId)
    );
    let isWishlisted = false;
    if (hotelExist) {
      isWishlisted = true;
      const resultUser = await this.UserRepository.findByOneAndUpdateWishlist(
        userId,
        hotelId,
        isWishlisted
      );
      let safedUserData;
      if (resultUser) {
        safedUserData = {
          _id: resultUser._id,
          firstName: resultUser.firstName,
          lastName: resultUser.lastName,
          email: resultUser.email,
          profileImage: resultUser.profileImage,
          isVerified: resultUser.isVerified,
          isBlocked: resultUser.isBlocked,
          isGoogle: resultUser.isGoogle,
          wishlist: resultUser.wishlist,
          wallet: resultUser.wallet,
          mobile: resultUser.mobile,
          walletHistory: resultUser.walletHistory,
        };
      }
      return {
        status: 200,
        data: {
          success: true,
          message: safedUserData,
        },
      };
    } else if (!hotelExist) {
      const resultUser = await this.UserRepository.findByOneAndUpdateWishlist(
        userId,
        hotelId,
        (isWishlisted = false)
      );
      let safedUserData;
      if (resultUser) {
        safedUserData = {
          _id: resultUser._id,
          firstName: resultUser.firstName,
          lastName: resultUser.lastName,
          email: resultUser.email,
          profileImage: resultUser.profileImage,
          isVerified: resultUser.isVerified,
          isBlocked: resultUser.isBlocked,
          isGoogle: resultUser.isGoogle,
          wishlist: resultUser.wishlist,
          wallet: resultUser.wallet,
          mobile: resultUser.mobile,
          walletHistory: resultUser.walletHistory,
        };
      }
      return {
        status: 200,
        data: {
          success: true,
          message: safedUserData,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          success: false,
          message: "Add/Remove wishlist failed!",
        },
      };
    }
  }

  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    const user: any = await this.UserRepository.findById(userId);
    const passwordMatch = await this.Encrypt.compare(
      currentPassword,
      user.password
    );
    if (passwordMatch) {
      const newHashedPassword = await this.Encrypt.generateHash(newPassword);
      const updatedUser = await this.UserRepository.findByIdAndUpdatePassword(
        userId,
        newHashedPassword
      );
      let safedUserData;
      if (updatedUser) {
        safedUserData = {
          _id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          profileImage: updatedUser.profileImage,
          isVerified: updatedUser.isVerified,
          isBlocked: updatedUser.isBlocked,
          isGoogle: updatedUser.isGoogle,
          wishlist: updatedUser.wishlist,
          wallet: updatedUser.wallet,
          mobile: updatedUser.mobile,
          walletHistory: updatedUser.walletHistory,
        };
      }
      return {
        status: 200,
        data: {
          success: true,
          message: safedUserData,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          success: false,
          message: "Entered wrong current password/ password not found!",
        },
      };
    }
  }

  async forgotPassword(email: string, newPassword: string) {
    const userExists = await this.UserRepository.findByEmail(email);

    if (userExists) {
      return {
        status: 200,
        data: {
          status: true,
          success: true,
          message: "Verification OTP sent to your email",
        },
      };
    } else {
      // If the user doesn't exist, return success with a verification message
      return {
        status: 400,
        data: {
          status: false,
          success: false,
          message: "User not found, Wrong Email id!",
        },
      };
    }
  }

  async verifyForgotPassword(email: string, newPassword: string) {
    const user: any = await this.UserRepository.findByEmail(email);

    const newHashedPassword = await this.Encrypt.generateHash(newPassword);
    const updatedUser = await this.UserRepository.findByIdAndUpdatePassword(
      user._id,
      newHashedPassword
    );
    let safedUserData;
    if (updatedUser) {
      safedUserData = {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
        isVerified: updatedUser.isVerified,
        isBlocked: updatedUser.isBlocked,
        isGoogle: updatedUser.isGoogle,
        wishlist: updatedUser.wishlist,
        wallet: updatedUser.wallet,
        mobile: updatedUser.mobile,
        walletHistory: updatedUser.walletHistory,
      };

      return safedUserData;
    } else {
      return;
    }
  }

  async addMoneyToWallet(addMoneyToWallet: any) {
    if (addMoneyToWallet) {
      const paymentData =
        await this.PaymentRepository.confirmAddMoneyToWalletPayment(
          addMoneyToWallet
        );
      return {
        status: 200,
        data: {
          success: true,
          message: paymentData,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: false,
          success: false,
          message: "Something went wrong in payment!",
        },
      };
    }
  }

  async confirmWalletPayment(request: any) {
    const paymentSuccess =
      await this.PaymentRepository.addMoneyToWalletPaymentSuccess(request);
    if (!paymentSuccess) {
      console.log("Payment faileddddd");
      return null;
    } else {
      return true;
    }
  }

  async addMoney(addMoneyToWalletDetails: any, transactionId: string) {
    const user = await this.UserRepository.findById(
      addMoneyToWalletDetails.userId
    );

    const walletHistory = {
      transactionDate: new Date(),
      transactionDetails: "Deposited via Stripe",
      transactionType: "Credit",
      transactionId: transactionId,
      transactionAmount: addMoneyToWalletDetails.amount,
      currentBalance: user?.wallet + addMoneyToWalletDetails.amount,
    };
    const updatedUser = await this.UserRepository.findByIdAndUpdateWallet(
      addMoneyToWalletDetails.userId,
      addMoneyToWalletDetails.amount,
      walletHistory
    );

    const safedUserData = {
      _id: updatedUser?._id,
      firstName: updatedUser?.firstName,
      lastName: updatedUser?.lastName,
      email: updatedUser?.email,
      profileImage: updatedUser?.profileImage,
      isVerified: updatedUser?.isVerified,
      isBlocked: updatedUser?.isBlocked,
      isGoogle: updatedUser?.isGoogle,
      wishlist: updatedUser?.wishlist,
      wallet: updatedUser?.wallet,
      mobile: updatedUser?.mobile,
      walletHistory: updatedUser?.walletHistory,
    };
    if (updatedUser) {
      return {
        status: 200,
        data: {
          success: true,
          message: safedUserData,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: false,
          success: false,
          message: "Something went wrong in adding money to wallet!",
        },
      };
    }
  }

  async getUpdatedUser(id: string) {
    const updatedUser = await this.UserRepository.findById(id);
    if (updatedUser) {
      const safedUserData = {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
        isVerified: updatedUser.isVerified,
        isBlocked: updatedUser.isBlocked,
        isGoogle: updatedUser.isGoogle,
        wishlist: updatedUser.wishlist,
        wallet: updatedUser.wallet,
        mobile: updatedUser.mobile,
        walletHistory: updatedUser.walletHistory,
      };
      return {
        status: 200,
        data: {
          success: true,
          message: safedUserData,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          success: false,
          message: "Updating user profile failed!",
        },
      };
    }
  }
}

export default UserUserCase;
