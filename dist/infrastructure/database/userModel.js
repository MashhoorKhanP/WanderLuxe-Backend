"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String },
    profileImage: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isGoogle: { type: Boolean, default: false },
    walletHistory: {
        type: [
            {
                transactionDate: {
                    type: Date,
                },
                transactionDetails: {
                    type: String,
                },
                transactionType: {
                    type: String,
                },
                transactionAmount: {
                    type: Number,
                },
                currentBalance: {
                    type: Number,
                },
                transactionId: {
                    type: String,
                },
            },
        ],
        default: [],
    },
    wishlist: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Hotel",
        },
    ],
    wallet: { type: Number, default: 0 },
}, {
    timestamps: true,
});
const UserModel = mongoose_1.default.model("User", userSchema);
exports.default = UserModel;
