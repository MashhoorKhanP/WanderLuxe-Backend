import { Request, Response } from "express";
import UserUserCase from "../../useCases/userUseCase";
import GenerateEmail from "../../infrastructure/services/sendMail";
import GenerateOTP from "../../infrastructure/services/generateOtp";
import { SocketManager } from "../../infrastructure/services/socket";
import ChatUseCase from "../../useCases/chatUseCase";

class UserController {
  private userUseCase: UserUserCase;
  private GenerateEmail: GenerateEmail;
  private GenerateOTP: GenerateOTP;
  private SocketManager: SocketManager;
  private chatUseCase: ChatUseCase;
  constructor(
    userUseCase: UserUserCase,
    GenerateEmail: GenerateEmail,
    GenerateOTP: GenerateOTP,
    SocketManager: SocketManager,
    chatUseCase: ChatUseCase
  ) {
    this.userUseCase = userUseCase;
    this.GenerateEmail = GenerateEmail;
    this.GenerateOTP = GenerateOTP;
    this.SocketManager = SocketManager;
    this.chatUseCase = chatUseCase;
  }

  async signUp(req: Request, res: Response) {
    try {
      const verifyUser = await this.userUseCase.signUp(
        req.body.email,
        req.body.mobile
      );
      if (
        verifyUser?.data?.message &&
        typeof verifyUser.data.message === "object" &&
        "createdAt" in verifyUser.data.message
      ) {
        return res.status(verifyUser.status).json({
          success: true,
          result: { ...verifyUser.data },
        });
      }
      if (verifyUser && verifyUser.data) {
        if (verifyUser.data.status === true && req.body.isGoogle) {
          let user = await this.userUseCase.verifyUser(req.body);
          if (user) {
            res.status(user.status).json({ ...user.data });
          }
        } else if (verifyUser.data.status === true) {
          req.app.locals.userData = req.body;
          const otp = this.GenerateOTP.generateOtp();
          req.app.locals.otp = otp;
          this.GenerateEmail.sendMail(req.body.email, otp);

          setTimeout(() => {
            req.app.locals.otp = null;
          }, 2 * 60000);

          res.status(verifyUser.status).json(verifyUser.data);
        } else {
          res.status(400).json({
            success: false,
            result: { ...(verifyUser.data || {}) }, // Ensure that verifyUser.data is defined
          });
        }
      } else {
        res.status(400).json({ success: false, result: {} });
      }
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  async googleSignUp(req: Request, res: Response) {
    try {
      const verifyUser = await this.userUseCase.googleSignUp(req.body.email);
      if (
        verifyUser?.data?.message &&
        typeof verifyUser.data.message === "object" &&
        "createdAt" in verifyUser.data.message
      ) {
        return res.status(verifyUser.status).json({
          success: true,
          result: { ...verifyUser.data },
        });
      }
      if (verifyUser && verifyUser.data) {
        if (verifyUser.data.status === true && req.body.isGoogle) {
          let user = await this.userUseCase.verifyUser(req.body);
          if (user) {
            res.status(user.status).json({ ...user.data });
          }
        }
      } else {
        res.status(400).json({
          success: false,
          data: { message: "You have been blocked by Admin" },
        });
      }
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  async userVerification(req: Request, res: Response) {
    try {
      const isForgotPassword = req.query.forgotPassword;
      if (isForgotPassword === "false") {
        if (req.body.otp.otp === req.app.locals.otp) {
          const user = await this.userUseCase.verifyUser(
            req.app.locals.userData
          );
          if (user) {
            req.app.locals.userData = null;
            req.app.locals.otp = null;
            res.status(user.status).json(user.data);
          }
        } else {
          res.status(400).json({
            success: false,
            data: {
              message: "Invalid otp",
            },
          });
        }
      } else {
        if (req.body.otp.otp === req.app.locals.otp) {
          const user = await this.userUseCase.verifyForgotPasswordUser(
            req.app.locals.forgotPasswordData,
            isForgotPassword as string
          );
          if (user) {
            req.app.locals.userData = null;
            req.app.locals.otp = null;
            res.status(user.status).json(user.data);
          }
        } else {
          res.status(400).json({
            success: false,
            data: {
              message: "Invalid otp",
            },
          });
        }
      }
    } catch (error) {
      const typedError: Error = error as Error;
      res.status(400).json(typedError.message);
    }
  }

  async resendOtp(req: Request, res: Response) {
    try {
      const otp = this.GenerateOTP.generateOtp();
      req.app.locals.otp = otp;
      this.GenerateEmail.sendMail(req.app.locals.userData.email, otp);

      setTimeout(() => {
        req.app.locals.otp = this.GenerateOTP.generateOtp();
      }, 3 * 6000);
      res.status(200).json({
        message: "Otp has been sent!(/backend/userController/resendOtp)",
      });
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json(typedError.message);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const user = await this.userUseCase.login(req.body);
      if (user.data.token) {
        res.cookie("userJWT", user.data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "none",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
      }

      res.status(user.status).json({
        success: true,
        result: { ...user.data },
      });
    } catch (error) {
      const typedError = error as Error;
      console.error("Error setting cookie:", typedError);
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const updatedUser = await this.userUseCase.updateProfile(
        userId,
        req.body
      );

      res.status(200).json({
        success: true,
        result: { ...updatedUser.data },
      });
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  async addRemoveFromWishlist(req: Request, res: Response) {
    try {
      const { hotelId, userId } = req.body;
      const result = await this.userUseCase.addRemoveFromWishlist(
        hotelId,
        userId
      );
      res.status(result.status).json({
        success: true,
        result: { ...result.data },
      });
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const { userId, currentPassword, newPassword } = req.body;
      const result = await this.userUseCase.updatePassword(
        userId,
        currentPassword,
        newPassword
      );
      res.status(result.status).json({
        success: true,
        result: { ...result.data },
      });
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email, newPassword } = req.body;
      req.app.locals.forgotPasswordData = req.body;
      const verifiedUser = await this.userUseCase.forgotPassword(
        email,
        newPassword
      );
      if (verifiedUser.data.status === true) {
        req.app.locals.userData = req.body;
        const otp = this.GenerateOTP.generateOtp();
        req.app.locals.otp = otp;
        this.GenerateEmail.sendMail(req.body.email, otp);

        setTimeout(() => {
          req.app.locals.otp = null;
        }, 2 * 60000);

        res.status(verifiedUser.status).json(verifiedUser.data);
      } else {
        res.status(400).json({
          success: false,
          result: { ...(verifiedUser.data || {}) }, // Ensure that verifyUser.data is defined
        });
      }
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  async addMoneyToWallet(req: Request, res: Response) {
    try {
      req.app.locals.wallet = req.body;
      const payment = await this.userUseCase.addMoneyToWallet(req.body);
      if (payment) {
        return res.status(payment.status).json({
          success: true,
          result: { ...payment.data },
        });
      } else {
        res.status(400).json({ success: false, result: {} });
      }
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  async walletWebhook(req: Request, res: Response) {
    try {
      const localData = req.app.locals.wallet;

      let transactionId;
      let receiptUrl;
      if (req.body.type === "charge.succeeded") {
        transactionId = req.body.data.object.payment_intent;
        receiptUrl = req.body.data.object.receipt_url;
      }
      const confirmPayment = await this.userUseCase.confirmWalletPayment(
        req as any
      );
      if (confirmPayment) {
        const added = await this.userUseCase.addMoney(localData, transactionId);
        req.app.locals.updatedWalletData = added.data.message;
        let messageData = JSON.parse(JSON.stringify(added.data.message));
        this.SocketManager.io.emit("message", messageData);

        return res.status(added.status).json({
          success: true,
          result: { ...added.data },
        });
      } else {
        res.status(400).json({ success: false, result: {} });
      }
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  async getUpdatedUser(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const updatedUser = await this.userUseCase.getUpdatedUser(userId);

      res.status(200).json({
        success: true,
        result: { ...updatedUser.data },
      });
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  //Chat
  async newConversation(req: Request, res: Response) {
    try {
      const members: any = [req.body.senderId, req.body.receiverId];
      const existing = await this.chatUseCase.checkExisting(members);
      if (!existing?.length) {
        const conversation = await this.chatUseCase.newConversation(members);
        res.status(200).json({
          success: true,
          result: { ...conversation.data },
        });
      }
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  async getConversations(req: Request, res: Response) {
    try {
      const conversations = await this.chatUseCase.getConversations(
        req.params.userId
      );
      res.status(200).json({
        success: true,
        result: { ...conversations.data },
      });
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  async addMessage(req: Request, res: Response) {
    try {
      const messages = await this.chatUseCase.addMessage({ ...req.body });
      res.status(200).json({
        success: true,
        result: { ...messages.data },
      });
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  async getMessages(req: Request, res: Response) {
    try {
      const messages = await this.chatUseCase.getMessages(
        req.params.conversationId
      );

      res.status(200).json({
        success: true,
        result: { ...messages.data },
      });
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }
}

export default UserController;
