"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GenerateOTP {
    generateOtp() {
        return Math.floor(1000 + Math.random() * 9000);
    }
}
exports.default = GenerateOTP;
