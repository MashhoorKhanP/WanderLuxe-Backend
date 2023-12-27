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

const hotelCase = new HotelUseCase(hotelRepository);
const roomCase = new RoomUseCase(roomRepository);
const couponCase = new CouponUseCase(couponRepository);
const userCase = new UserUserCase(userRepository, encrypt, jwt);
const bookingCase = new BookingUseCase(bookingRepository,paymentRepository);

const controller = new UserController(userCase, email, otp);
const hotelController = new HotelController(hotelCase);
const roomController = new RoomController(roomCase);
const couponController = new CouponController(couponCase);
const bookingController = new BookingController(bookingCase);

const router = express.Router();

router.post("/signup", (req, res) => controller.signUp(req, res));
router.post("/google-signup", (req, res) => controller.googleSignUp(req, res));
router.post("/verify-otp", (req, res) => controller.userVerification(req, res));
router.post("/resend-otp", (req, res) => controller.resendOtp(req, res));
router.post("/login", (req, res) => controller.login(req, res));
router.patch("/profile/:userId", auth, (req, res) =>
  controller.updateProfile(req, res)
);

router.get("/find-hotels", (req, res) => hotelController.getHotels(req, res));
router.get("/find-rooms", (req, res) => roomController.getRooms(req, res));
router.get("/find-coupons",(req,res) => couponController.getCoupons(req,res));
router.get("/find-bookings",(req,res) => bookingController.getBookings(req,res));
router.get('/my-bookings/:userId', (req, res) => bookingController.getUserBookings(req,res));

router.patch("/add-remove/wishlist", auth, (req, res) =>
  controller.addRemoveFromWishlist(req, res)
);

router.patch("/change-password", auth, (req, res) =>
  controller.updatePassword(req, res)
);

router.post("/payment",auth,(req,res) => bookingController.payment(req,res));
router.post("/webhook",(req,res) => bookingController.webhook(req,res));

export default router;
