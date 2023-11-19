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

router.post('/signup',googleAuth,(req,res) => controller.signUp(req,res));
router.post('/verify-otp',googleAuth,(req,res) => controller.userVerification(req,res));
router.post('/resend-otp',googleAuth,(req,res)=>controller.resendOtp(req,res));
router.post('/login',googleAuth,(req,res)=>controller.login(req,res));


export default router;
