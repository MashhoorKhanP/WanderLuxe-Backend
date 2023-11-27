import express from "express";
import Encrypt from "../services/bcryptPassword";
import JWTToken from "../services/generateToken";
import AdminRepository from "../repositories/adminRepository";
import UserRepository from "../repositories/userRepository";
import AdminUseCase from "../../useCases/adminUseCase";
import AdminController from "../../adapter/controllers/adminController";
import adminAuth from "../middlewares/adminAuth";

const encrypt = new Encrypt();
const jwt = new JWTToken();

const adminRepository = new AdminRepository();
const userRepository = new UserRepository();

const adminCase = new AdminUseCase(
  adminRepository,
  userRepository,
  encrypt,
  jwt
);

const controller = new AdminController(adminCase);

const router = express.Router();

router.post("/login", (req, res) => controller.login(req, res));
router.get("/users",adminAuth, (req, res) => controller.getUsers(req, res));
router.patch("/users/update-user/:userId",adminAuth, (req, res) =>controller.updateUsers(req, res));

export default router;
