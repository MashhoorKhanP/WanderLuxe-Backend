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
import RoomRepository from "../repositories/roomRepository";
import RoomUseCase from "../../useCases/roomUseCase";
import RoomController from "../../adapter/controllers/roomController";
import CouponRepository from "../repositories/couponRepository";
import CouponUseCase from "../../useCases/couponUseCase";
import CouponController from "../../adapter/controllers/couponController";
import BookingRepository from "../repositories/bookingRepository";
import BookingUseCase from "../../useCases/bookingUseCase";
import BookingController from "../../adapter/controllers/bookingController";
import PaymentRepository from "../services/stripe";
import ConversationRepository from "../repositories/conversationRepository";
import ChatUseCase from "../../useCases/chatUseCase";
import MessageRepository from "../repositories/messageRepository";

const encrypt = new Encrypt();
const jwt = new JWTToken();

const adminRepository = new AdminRepository();
const userRepository = new UserRepository();
const hotelRepository = new HotelRepository();
const roomRepository = new RoomRepository();
const couponRepository = new CouponRepository();
const bookingRepository = new BookingRepository();

const adminCase = new AdminUseCase(
  adminRepository,
  userRepository,
  encrypt,
  jwt
);
const hotelCase = new HotelUseCase(hotelRepository);
const roomCase = new RoomUseCase(roomRepository)
const couponCase = new CouponUseCase(couponRepository);
const paymentRepository = new PaymentRepository();
const conversationRepository = new ConversationRepository();
const messageRepository = new MessageRepository();
const conversationCase = new ChatUseCase(conversationRepository,messageRepository,userRepository,adminRepository)
const bookingCase = new BookingUseCase(bookingRepository,paymentRepository,roomRepository,couponRepository,userRepository);

const adminController = new AdminController(adminCase,conversationCase);
const hotelController = new HotelController(hotelCase);
const roomController = new RoomController(roomCase);
const couponController = new CouponController(couponCase);
const bookingController = new BookingController(bookingCase);

const router = express.Router();

router.post("/login", (req, res) => adminController.login(req, res));
router.get("/users", adminAuth, (req, res) => adminController.getUsers(req, res));
router.patch("/users/update-user/:userId", adminAuth, (req, res) =>
  adminController.updateUsers(req, res)
);

router.post("/hotels/add-hotel", adminAuth, (req, res) =>
  hotelController.addHotel(req, res)
);
router.delete("/hotels/delete-hotel/:hotelId", adminAuth, (req, res) =>
  hotelController.deleteHotel(req, res)
);
router.patch("/hotels/update-hotel/:hotelId", adminAuth, (req, res) =>
  hotelController.updateHotel(req, res)
);

router.post("/rooms/add-room", adminAuth, (req, res) =>
 roomController.addRoom(req, res)
);
router.delete("/rooms/delete-room/:roomId", adminAuth, (req, res) =>
  roomController.deleteRoom(req, res)
);
router.patch("/rooms/update-room/:roomId", adminAuth, (req, res) =>
  roomController.updateRoom(req, res)
);

router.post("/coupons/add-coupon", adminAuth, (req, res) =>
 couponController.addCoupon(req, res)
);
router.patch("/coupons/update-coupon/:couponId", adminAuth, (req, res) =>
  couponController.updateCoupon(req, res)
);
router.delete("/coupons/delete-coupon/:couponId", adminAuth, (req, res) =>
  couponController.deleteCoupon(req, res)
);

router.patch("/bookings/update-booking/:bookingId", adminAuth, (req, res) =>
  bookingController.updateBooking(req, res)
);

//chat
router.post('/conversation',(req,res) => adminController.newConversation(req,res));
router.get('/get-conversations/:conversationId',(req,res) => adminController.getConversations(req,res));
router.post('/add-message',(req,res) => adminController.addMessage(req,res));
router.get('/get-message/:conversationId',(req,res) => adminController.getMessages(req,res));




export default router;
