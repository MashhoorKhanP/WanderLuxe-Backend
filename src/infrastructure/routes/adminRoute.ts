import express from 'express';
import Encrypt from '../services/bcryptPassword';
import JWTToken from '../services/generateToken';
import AdminRepository from '../repositories/adminRepository';
import UserRepository from '../repositories/userRepository';
import AdminUseCase from '../../useCases/adminUseCase';
import AdminController from '../../adapter/controllers/adminController';


const encrypt = new Encrypt();
const jwt = new JWTToken();

const adminRepository = new AdminRepository();
// const userRepository = new UserRepository();

const adminCase = new AdminUseCase(adminRepository,encrypt,jwt,/**userRepository*/);

const controller = new AdminController(adminCase);

const router = express.Router();

router.post('/login',(req,res) => controller.login(req,res));

export default router;