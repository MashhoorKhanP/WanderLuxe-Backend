import { Request, Response } from "express";
import AdminUseCase from "../../useCases/adminUseCase";
import ChatUseCase from "../../useCases/chatUseCase";

class AdminController {
  private adminUseCase: AdminUseCase;
  private chatUseCase: ChatUseCase;
  constructor(adminUseCase: AdminUseCase, chatUseCase: ChatUseCase) {
    this.adminUseCase = adminUseCase;
    this.chatUseCase = chatUseCase;
  }

  async login(req: Request, res: Response) {
    try {
      const admin = await this.adminUseCase.login(req.body);
      if (admin.data.token) {
        res.cookie("adminJWT", admin.data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: "none",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
      }
      res.status(admin.status).json({
        success: true,
        result: { ...admin.data },
      });
    } catch (error) {
      const typedError = error as Error;
      console.error("Error setting cookie:", typedError);
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await this.adminUseCase.getUsers();
      res.status(users.status).json({
        success: true,
        result: { ...users.data },
      });
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  async updateUsers(req: Request, res: Response) {
    try {
      const userId = req.params.userId as string;
      const { isVerified, isBlocked } = req.body;
      const updatedUser = await this.adminUseCase.updateUser(
        userId,
        isVerified,
        isBlocked
      );
      res.status(updatedUser.status as number).json({
        success: true,
        result: { updatedUser },
      });
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

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
        req.params.conversationId
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

export default AdminController;
