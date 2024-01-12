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
class AdminUseCase {
    constructor(AdminRepository, UserRepository, Encrypt, JWTToken) {
        this.AdminRepository = AdminRepository;
        this.UserRepository = UserRepository;
        this.Encrypt = Encrypt;
        this.JWTToken = JWTToken;
    }
    login(admin) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminData = yield this.AdminRepository.findByEmail(admin.email);
            if (adminData) {
                const passwordMatch = yield this.Encrypt.compare(admin.password, adminData.password);
                if (passwordMatch) {
                    const role = "admin";
                    const token = this.JWTToken.generateToken(adminData._id, adminData.email, adminData.firstName, adminData.profileImage, adminData.lastName, role);
                    const safedAdminData = {
                        _id: adminData._id,
                        email: adminData.email,
                        firstName: adminData.firstName,
                        lastName: adminData.lastName,
                        profileImage: adminData.profileImage,
                    };
                    return {
                        status: 200,
                        data: {
                            success: true,
                            message: safedAdminData,
                            token,
                        },
                    };
                }
                else {
                    return {
                        status: 400,
                        data: {
                            success: false,
                            message: "Invalid email or password!",
                            token: null,
                        },
                    };
                }
            }
            else {
                return {
                    status: 400,
                    data: {
                        success: false,
                        message: "Invalid email or password!",
                        token: null,
                    },
                };
            }
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const usersList = yield this.UserRepository.findAllUsers();
            return {
                status: 200,
                data: {
                    success: true,
                    message: usersList,
                },
            };
        });
    }
    updateUser(userId, isVerified, isBlocked) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateUser = yield this.UserRepository.findByIdAndUpdate(userId, isVerified, isBlocked);
            if (updateUser) {
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: updateUser._id,
                    },
                };
            }
            else {
                return {
                    data: {
                        success: false,
                        message: "User not found",
                    },
                };
            }
        });
    }
}
exports.default = AdminUseCase;
