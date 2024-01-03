import express from "express";

import Encrypt from "../services/bcryptPassword";
import JWTToken from "../services/generateToken";

import UserRepository from "../repositories/userRepository";
import UserUserCase from "../../useCases/userUseCase";
import UserController from "../../adapter/controllers/userController";
import GenerateOTP from "../services/generateOtp";
import GenerateEmail from "../services/sendMail";
import auth from "../middlewares/auth";
import HotelController from "../../adapter/controllers/hotelController";
import HotelRepository from "../repositories/hotelRepository";
import HotelUseCase from "../../useCases/hotelUseCase";
import RoomRepository from "../repositories/roomRepository";
import RoomUseCase from "../../useCases/roomUseCase";
import RoomController from "../../adapter/controllers/roomController";
import CouponRepository from "../repositories/couponRepository";
import CouponUseCase from "../../useCases/couponUseCase";
import CouponController from "../../adapter/controllers/couponController";
import PaymentRepository from "../services/stripe";
import BookingUseCase from "../../useCases/bookingUseCase";
import BookingRepository from "../repositories/bookingRepository";
import BookingController from "../../adapter/controllers/bookingController";
import { SocketManager } from "../services/socket";
import http from "http"; 
import ConversationRepository from "../repositories/conversationRepository";
import ChatUseCase from "../../useCases/chatUseCase";
import MessageRepository from "../repositories/messageRepository";
import AdminRepository from "../repositories/adminRepository";

const encrypt = new Encrypt();
const jwt = new JWTToken();
const otp = new GenerateOTP();
const email = new GenerateEmail();

const userRepository = new UserRepository();
const hotelRepository = new HotelRepository();
const roomRepository = new RoomRepository();
const couponRepository = new CouponRepository();
const paymentRepository = new PaymentRepository();
const bookingRepository = new BookingRepository();
const adminRepository = new AdminRepository();
const conversationRepository = new ConversationRepository();
const messageRepository = new MessageRepository();
const server = http.createServer(express()); // Create an HTTP server instance
const socket = new SocketManager(server, userRepository);


const hotelCase = new HotelUseCase(hotelRepository);
const roomCase = new RoomUseCase(roomRepository);
const couponCase = new CouponUseCase(couponRepository);
const userCase = new UserUserCase(userRepository, encrypt, jwt,paymentRepository);
const bookingCase = new BookingUseCase(bookingRepository,paymentRepository,roomRepository,couponRepository,userRepository);
const conversationCase = new ChatUseCase(conversationRepository,messageRepository,userRepository,adminRepository)

const userController = new UserController(userCase, email, otp,socket,conversationCase);
const hotelController = new HotelController(hotelCase);
const roomController = new RoomController(roomCase);
const couponController = new CouponController(couponCase);
const bookingController = new BookingController(bookingCase);

const router = express.Router();

router.post("/signup", (req, res) => userController.signUp(req, res));
router.post("/google-signup", (req, res) => userController.googleSignUp(req, res));
router.post("/verify-otp", (req, res) => userController.userVerification(req, res));
router.post("/resend-otp", (req, res) => userController.resendOtp(req, res));
router.post("/login", (req, res) => userController.login(req, res));
router.patch("/profile/:userId", auth, (req, res) =>
  userController.updateProfile(req, res)
);

router.get("/find-hotels", (req, res) => hotelController.getHotels(req, res));
router.get("/find-rooms", (req, res) => roomController.getRooms(req, res));
router.get("/find-coupons",(req,res) => couponController.getCoupons(req,res));
router.get("/find-bookings",(req,res) => bookingController.getBookings(req,res));
router.get('/my-bookings/:userId', (req, res) => bookingController.getUserBookings(req,res));
router.get('/hotel-bookings/:hotelId', (req, res) => bookingController.getHotelBookings(req,res));
router.patch("/my-bookings/cancel-booking/:bookingId", auth, (req, res) =>
  bookingController.updateBooking(req, res)
);

router.patch("/add-remove/wishlist", auth, (req, res) =>
  userController.addRemoveFromWishlist(req, res)
);

router.patch("/change-password", auth, (req, res) =>
  userController.updatePassword(req, res)
);

router.post("/wallet-payment",auth,(req,res) => bookingController.walletPayment(req,res));
router.post("/payment",auth,(req,res) => bookingController.payment(req,res));
router.post("/webhook",(req,res) => bookingController.webhook(req,res));
router.post("/add-money-to-wallet",(req,res) => userController.addMoneyToWallet(req,res));
router.post("/wallet/webhook",(req,res) => userController.walletWebhook(req,res));
router.get("/updated-user/:userId", (req, res) => userController.getUpdatedUser(req, res));

//chat
router.post('/conversation', (req,res) => userController.newConversation(req,res));
router.get('/get-conversations/:userId',(req,res) => userController.getConversations(req,res));
router.post('/add-message',(req,res) => userController.addMessage(req,res));
router.get('/get-message/:conversationId',(req,res) => userController.getMessages(req,res));

export default router;
