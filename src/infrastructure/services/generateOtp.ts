import OTP from "../../useCases/interfaces/otp";

class GenerateOTP implements OTP {
  generateOtp(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }
}

export default GenerateOTP;
