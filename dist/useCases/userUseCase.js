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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class UserUserCase {
    constructor(UserRepository, Encrypt, JWTToken, PaymentRepository) {
        this.UserRepository = UserRepository;
        this.Encrypt = Encrypt;
        this.JWTToken = JWTToken;
        this.PaymentRepository = PaymentRepository;
    }
    googleSignUp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExists = yield this.UserRepository.findByEmail(email);
            if (userExists) {
                if (userExists.isGoogle) {
                    // If the user is blocked, return an error
                    if (userExists === null || userExists === void 0 ? void 0 : userExists.isBlocked) {
                        return {
                            status: 400,
                            data: {
                                success: false,
                                message: "You have been blocked by admin!",
                                token: "",
                            },
                        };
                    }
                    // If the user is not blocked, generate a token and return success
                    const userId = userExists === null || userExists === void 0 ? void 0 : userExists._id;
                    if (userId) {
                        const role = "user";
                        const token = this.JWTToken.generateToken(userExists._id, userExists.email, userExists.firstName, userExists.lastName, userExists.profileImage, role);
                        return {
                            status: 200,
                            data: {
                                success: true,
                                message: userExists,
                                token,
                            },
                        };
                    }
                }
                else {
                    // If the user is not a Google user, return an error
                    return {
                        status: 400,
                        data: {
                            status: false,
                            success: false,
                            message: "User already exists!",
                        },
                    };
                }
            }
            else {
                // If the user doesn't exist, return success with a verification message
                return {
                    status: 200,
                    data: {
                        status: true,
                        success: true,
                        message: "Verification OTP sent to your email",
                    },
                };
            }
        });
    }
    signUp(email, mobile) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExists = yield this.UserRepository.findByEmail(email);
            const sameMobileExits = yield this.UserRepository.findByMobile(mobile);
            if (userExists) {
                return {
                    status: 400,
                    data: {
                        status: false,
                        success: false,
                        message: "User already exists!",
                    },
                };
            }
            if (sameMobileExits) {
                return {
                    status: 400,
                    data: {
                        status: false,
                        success: false,
                        message: "Mobile Number already exist!",
                    },
                };
            }
            else {
                // If the user doesn't exist, return success with a verification message
                return {
                    status: 200,
                    data: {
                        status: true,
                        success: true,
                        message: "Verification OTP sent to your email",
                    },
                };
            }
        });
    }
    verifyUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            var token = "";
            if (user.password) {
                const hashedPassword = yield this.Encrypt.generateHash(user.password);
                const newUser = Object.assign(Object.assign({}, user), { password: hashedPassword });
                const role = "user";
                if (user)
                    token = this.JWTToken.generateToken(user._id, user.firstName, user.lastName, user.email, user.profileImage, role);
                const savedUser = yield this.UserRepository.save(newUser);
                const safedUserData = {
                    _id: savedUser._id,
                    firstName: savedUser.firstName,
                    lastName: savedUser.lastName,
                    email: savedUser.email,
                    profileImage: savedUser.profileImage,
                    isVerified: savedUser.isVerified,
                    isBlocked: savedUser.isBlocked,
                    isGoogle: savedUser.isGoogle,
                    wishlist: savedUser.wishlist,
                    wallet: savedUser.wallet,
                    mobile: savedUser.mobile,
                    walletHistory: savedUser.walletHistory,
                };
                return {
                    status: 200,
                    data: {
                        status: true,
                        success: true,
                        message: Object.assign({}, safedUserData),
                        token,
                    },
                };
            }
        });
    }
    verifyForgotPasswordUser(user, isForgotPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield this.verifyForgotPassword(user.email, user.newPassword);
            if (userData) {
                return {
                    status: 200,
                    data: {
                        status: true,
                        success: true,
                        message: userData,
                    },
                };
            }
            else {
                return {
                    status: 400,
                    data: {
                        success: false,
                        message: "User not found, Something went wrong",
                    },
                };
            }
        });
    }
    login(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield this.UserRepository.findByEmail(user.email);
            let token = "";
            if (userData) {
                if (userData === null || userData === void 0 ? void 0 : userData.isBlocked) {
                    return {
                        status: 400,
                        data: {
                            success: false,
                            message: "You have been blocked by admin!",
                            token: "",
                        },
                    };
                }
                const passwordMatch = yield this.Encrypt.compare(user.password, userData.password);
                if (passwordMatch) {
                    const userId = userData === null || userData === void 0 ? void 0 : userData._id;
                    const role = "user";
                    if (userId)
                        token = this.JWTToken.generateToken(userData._id, userData.email, userData.firstName, userData.lastName, userData.profileImage, role);
                    const safedUserData = {
                        _id: userData._id,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        email: userData.email,
                        profileImage: userData.profileImage,
                        isVerified: userData.isVerified,
                        isBlocked: userData.isBlocked,
                        isGoogle: userData.isGoogle,
                        wishlist: userData.wishlist,
                        wallet: userData.wallet,
                        mobile: userData.mobile,
                        walletHistory: userData.walletHistory,
                    };
                    return {
                        status: 200,
                        data: {
                            success: true,
                            message: safedUserData,
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
                            token,
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
                        token,
                    },
                };
            }
        });
    }
    updateProfile(id, reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield this.UserRepository.findByIdAndUpdateProfile(id, reqBody);
            if (updatedUser) {
                const safedUserData = {
                    _id: updatedUser._id,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    email: updatedUser.email,
                    profileImage: updatedUser.profileImage,
                    isVerified: updatedUser.isVerified,
                    isBlocked: updatedUser.isBlocked,
                    isGoogle: updatedUser.isGoogle,
                    wishlist: updatedUser.wishlist,
                    wallet: updatedUser.wallet,
                    mobile: updatedUser.mobile,
                    walletHistory: updatedUser.walletHistory,
                };
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: safedUserData,
                    },
                };
            }
            else {
                return {
                    status: 400,
                    data: {
                        success: false,
                        message: "Updating user profile failed!",
                    },
                };
            }
        });
    }
    addRemoveFromWishlist(hotelId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            //Continue find user then update wishlist as nonstop fashion
            const user = yield this.UserRepository.findById(userId);
            const hotelObjectId = new mongoose_1.default.Types.ObjectId(hotelId);
            const hotelExist = user.wishlist.some((data) => data.equals(hotelObjectId));
            let isWishlisted = false;
            if (hotelExist) {
                isWishlisted = true;
                const resultUser = yield this.UserRepository.findByOneAndUpdateWishlist(userId, hotelId, isWishlisted);
                let safedUserData;
                if (resultUser) {
                    safedUserData = {
                        _id: resultUser._id,
                        firstName: resultUser.firstName,
                        lastName: resultUser.lastName,
                        email: resultUser.email,
                        profileImage: resultUser.profileImage,
                        isVerified: resultUser.isVerified,
                        isBlocked: resultUser.isBlocked,
                        isGoogle: resultUser.isGoogle,
                        wishlist: resultUser.wishlist,
                        wallet: resultUser.wallet,
                        mobile: resultUser.mobile,
                        walletHistory: resultUser.walletHistory,
                    };
                }
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: safedUserData,
                    },
                };
            }
            else if (!hotelExist) {
                const resultUser = yield this.UserRepository.findByOneAndUpdateWishlist(userId, hotelId, (isWishlisted = false));
                let safedUserData;
                if (resultUser) {
                    safedUserData = {
                        _id: resultUser._id,
                        firstName: resultUser.firstName,
                        lastName: resultUser.lastName,
                        email: resultUser.email,
                        profileImage: resultUser.profileImage,
                        isVerified: resultUser.isVerified,
                        isBlocked: resultUser.isBlocked,
                        isGoogle: resultUser.isGoogle,
                        wishlist: resultUser.wishlist,
                        wallet: resultUser.wallet,
                        mobile: resultUser.mobile,
                        walletHistory: resultUser.walletHistory,
                    };
                }
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: safedUserData,
                    },
                };
            }
            else {
                return {
                    status: 400,
                    data: {
                        success: false,
                        message: "Add/Remove wishlist failed!",
                    },
                };
            }
        });
    }
    updatePassword(userId, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.UserRepository.findById(userId);
            const passwordMatch = yield this.Encrypt.compare(currentPassword, user.password);
            if (passwordMatch) {
                const newHashedPassword = yield this.Encrypt.generateHash(newPassword);
                const updatedUser = yield this.UserRepository.findByIdAndUpdatePassword(userId, newHashedPassword);
                let safedUserData;
                if (updatedUser) {
                    safedUserData = {
                        _id: updatedUser._id,
                        firstName: updatedUser.firstName,
                        lastName: updatedUser.lastName,
                        email: updatedUser.email,
                        profileImage: updatedUser.profileImage,
                        isVerified: updatedUser.isVerified,
                        isBlocked: updatedUser.isBlocked,
                        isGoogle: updatedUser.isGoogle,
                        wishlist: updatedUser.wishlist,
                        wallet: updatedUser.wallet,
                        mobile: updatedUser.mobile,
                        walletHistory: updatedUser.walletHistory,
                    };
                }
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: safedUserData,
                    },
                };
            }
            else {
                return {
                    status: 400,
                    data: {
                        success: false,
                        message: "Entered wrong current password/ password not found!",
                    },
                };
            }
        });
    }
    forgotPassword(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExists = yield this.UserRepository.findByEmail(email);
            if (userExists) {
                return {
                    status: 200,
                    data: {
                        status: true,
                        success: true,
                        message: "Verification OTP sent to your email",
                    },
                };
            }
            else {
                // If the user doesn't exist, return success with a verification message
                return {
                    status: 400,
                    data: {
                        status: false,
                        success: false,
                        message: "User not found, Wrong Email id!",
                    },
                };
            }
        });
    }
    verifyForgotPassword(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.UserRepository.findByEmail(email);
            const newHashedPassword = yield this.Encrypt.generateHash(newPassword);
            const updatedUser = yield this.UserRepository.findByIdAndUpdatePassword(user._id, newHashedPassword);
            let safedUserData;
            if (updatedUser) {
                safedUserData = {
                    _id: updatedUser._id,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    email: updatedUser.email,
                    profileImage: updatedUser.profileImage,
                    isVerified: updatedUser.isVerified,
                    isBlocked: updatedUser.isBlocked,
                    isGoogle: updatedUser.isGoogle,
                    wishlist: updatedUser.wishlist,
                    wallet: updatedUser.wallet,
                    mobile: updatedUser.mobile,
                    walletHistory: updatedUser.walletHistory,
                };
                return safedUserData;
            }
            else {
                return;
            }
        });
    }
    addMoneyToWallet(addMoneyToWallet) {
        return __awaiter(this, void 0, void 0, function* () {
            if (addMoneyToWallet) {
                const paymentData = yield this.PaymentRepository.confirmAddMoneyToWalletPayment(addMoneyToWallet);
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: paymentData,
                    },
                };
            }
            else {
                return {
                    status: 400,
                    data: {
                        status: false,
                        success: false,
                        message: "Something went wrong in payment!",
                    },
                };
            }
        });
    }
    confirmWalletPayment(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const paymentSuccess = yield this.PaymentRepository.addMoneyToWalletPaymentSuccess(request);
            if (!paymentSuccess) {
                console.log("Payment faileddddd");
                return null;
            }
            else {
                return true;
            }
        });
    }
    addMoney(addMoneyToWalletDetails, transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.UserRepository.findById(addMoneyToWalletDetails.userId);
            const walletHistory = {
                transactionDate: new Date(),
                transactionDetails: "Deposited via Stripe",
                transactionType: "Credit",
                transactionId: transactionId,
                transactionAmount: addMoneyToWalletDetails.amount,
                currentBalance: (user === null || user === void 0 ? void 0 : user.wallet) + addMoneyToWalletDetails.amount,
            };
            const updatedUser = yield this.UserRepository.findByIdAndUpdateWallet(addMoneyToWalletDetails.userId, addMoneyToWalletDetails.amount, walletHistory);
            const safedUserData = {
                _id: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser._id,
                firstName: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.firstName,
                lastName: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.lastName,
                email: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.email,
                profileImage: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.profileImage,
                isVerified: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.isVerified,
                isBlocked: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.isBlocked,
                isGoogle: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.isGoogle,
                wishlist: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.wishlist,
                wallet: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.wallet,
                mobile: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.mobile,
                walletHistory: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.walletHistory,
            };
            if (updatedUser) {
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: safedUserData,
                    },
                };
            }
            else {
                return {
                    status: 400,
                    data: {
                        status: false,
                        success: false,
                        message: "Something went wrong in adding money to wallet!",
                    },
                };
            }
        });
    }
    getUpdatedUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield this.UserRepository.findById(id);
            if (updatedUser) {
                const safedUserData = {
                    _id: updatedUser._id,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    email: updatedUser.email,
                    profileImage: updatedUser.profileImage,
                    isVerified: updatedUser.isVerified,
                    isBlocked: updatedUser.isBlocked,
                    isGoogle: updatedUser.isGoogle,
                    wishlist: updatedUser.wishlist,
                    wallet: updatedUser.wallet,
                    mobile: updatedUser.mobile,
                    walletHistory: updatedUser.walletHistory,
                };
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: safedUserData,
                    },
                };
            }
            else {
                return {
                    status: 400,
                    data: {
                        success: false,
                        message: "Updating user profile failed!",
                    },
                };
            }
        });
    }
}
exports.default = UserUserCase;
