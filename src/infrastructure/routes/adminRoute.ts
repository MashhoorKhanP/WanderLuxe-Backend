import express from "express";
import Encrypt from "../services/bcryptPassword";
import JWTToken from "../services/generateToken";
import AdminRepository from "../repositories/adminRepository";
import UserRepository from "../repositories/userRepository";
import AdminUseCase from "../../useCases/adminUseCase";
import AdminController from "../../adapter/controllers/adminController";
import adminAuth from "../middlewares/adminAuth";
import HotelRepository from "../repositories/hotelRepository";
import HotelUseCase from "../../useCases/hotelUseCase";
import HotelController from "../../adapter/controllers/hotelController";

const encrypt = new Encrypt();
const jwt = new JWTToken();

const adminRepository = new AdminRepository();
const userRepository = new UserRepository();
const hotelRepository = new HotelRepository();

const adminCase = new AdminUseCase(
  adminRepository,
  userRepository,
  encrypt,
  jwt
);
const hotelCase = new HotelUseCase(
  hotelRepository
)

const controller = new AdminController(adminCase);
const hotelController = new HotelController(hotelCase)

const router = express.Router();

router.post("/login", (req, res) => controller.login(req, res));
router.get("/users",adminAuth, (req, res) => controller.getUsers(req, res));
router.patch("/users/update-user/:userId",adminAuth, (req, res) =>controller.updateUsers(req, res));

router.post('/hotels/add-hotel',adminAuth,(req,res) => hotelController.addHotel(req,res));
router.delete('/hotels/delete-hotel/:hotelId',adminAuth,(req,res) => hotelController.deleteHotel(req,res));
router.patch('/hotels/update-hotel/:hotelId',adminAuth,(req,res) => hotelController.updateHotel(req,res));
export default router;
