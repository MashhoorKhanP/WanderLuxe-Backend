"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptPassword_1 = __importDefault(require("../services/bcryptPassword"));
const generateToken_1 = __importDefault(require("../services/generateToken"));
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const userUseCase_1 = __importDefault(require("../../useCases/userUseCase"));
const userController_1 = __importDefault(require("../../adapter/controllers/userController"));
const generateOtp_1 = __importDefault(require("../services/generateOtp"));
const sendMail_1 = __importDefault(require("../services/sendMail"));
const encrypt = new bcryptPassword_1.default();
const jwt = new generateToken_1.default();
const otp = new generateOtp_1.default();
const email = new sendMail_1.default();
const userRepository = new userRepository_1.default();
const userCase = new userUseCase_1.default(userRepository, encrypt, jwt);
const controller = new userController_1.default(userCase, email, otp);
const router = express_1.default.Router();
router.post('/signup', (req, res) => controller.signUp(req, res));
exports.default = router;
