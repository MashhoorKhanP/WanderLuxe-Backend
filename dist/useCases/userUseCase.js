"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class UserUserCase {
    constructor(UserRepository, Encrypt, JWTToken) {
        this.UserRepository = UserRepository;
        this.Encrypt = Encrypt;
        this.JWTToken = JWTToken;
    }
    signUp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExists = yield this.UserRepository.findByEmail(email);
            if (userExists) {
                return {
                    status: 400,
                    data: {
                        status: false,
                        message: "User already exists!",
                    },
                };
            }
            return {
                status: 200,
                data: {
                    status: true,
                    message: "Verification OTP sent to your email",
                },
            };
        });
    }
    verifyUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(user);
            const hashedPassword = yield this.Encrypt.generateHash(user.password);
            const newUser = Object.assign(Object.assign({}, user), { password: hashedPassword });
            yield this.UserRepository.save(newUser);
            return {
                status: 200,
                data: { status: true, message: "User registered successfully" },
            };
        });
    }
}
exports.default = UserUserCase;
