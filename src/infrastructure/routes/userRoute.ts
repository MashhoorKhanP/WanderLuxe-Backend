import express from "express";

import Encrypt from "../services/bcryptPassword";
import JWTToken from "../services/generateToken";

import UserRepository from "../repositories/userRepository";
import UserUserCase from "../../useCases/userUseCase";
import UserController from "../../adapter/controllers/userController";
import GenerateOTP from "../services/generateOtp";
import GenerateEmail from "../services/sendMail";
import googleAuth from "../middlewares/googleAuth";


const encrypt = new Encrypt();
const jwt = new JWTToken();
const otp = new GenerateOTP();
const email = new GenerateEmail();

const userRepository = new UserRepository();

const userCase = new UserUserCase(userRepository,encrypt,jwt);
const controller = new UserController(userCase,email,otp);

const router = express.Router();

router.post('/signup',(req,res) => controller.signUp(req,res));
router.post('/google-signup',(req,res) =>controller.signUp(req,res));
router.post('/verify-otp',(req,res) => controller.userVerification(req,res));
router.post('/resend-otp',(req,res)=>controller.resendOtp(req,res));
router.post('/login',(req,res)=>controller.login(req,res));
router.patch('/profile/:userId',(req,res) => controller.updateProfile(req,res)); // todo: uncomment and check the jwt auth in gooleAuth


export default router;
