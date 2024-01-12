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
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const stripeSecretKey = process.env.STRIPE_KEY;
if (!stripeSecretKey) {
    throw new Error("Stripe secret key is not defined");
}
const stripe = new stripe_1.default(stripeSecretKey);
class PaymentRepository {
    confirmPayment(bookingData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, mobile, userId, roomType, hotelName, roomImage, roomId, adults, children, couponDiscount, totalRoomsCount, appliedCouponId, checkInDate, checkOutDate, checkInTime, checkOutTime, numberOfNights, totalAmount, } = bookingData;
            const session = yield stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [
                    {
                        price_data: {
                            currency: "inr",
                            product_data: {
                                name: roomType,
                                images: [roomImage],
                                description: `Thanks for booking ${roomType} room at ${hotelName},Check-in on ${checkInDate}-${checkInTime} and Check-out on ${checkOutDate}-${checkOutTime}.`,
                                metadata: {
                                    roomId,
                                    userId,
                                },
                            },
                            unit_amount: totalAmount * 100,
                        },
                        quantity: 1,
                    },
                ],
                billing_address_collection: "required",
                mode: "payment",
                success_url: `${process.env.CLIENT_URL}/payment-success`,
                cancel_url: `${process.env.CLIENT_URL}/payment-failed`, // check ensure here
            });
            return session;
        });
    }
    confirmAddMoneyToWalletPayment(addMoneyToWalletData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, amount } = addMoneyToWalletData;
            const session = yield stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [
                    {
                        price_data: {
                            currency: "inr",
                            product_data: {
                                name: "Add Money To Wallet",
                                images: [
                                    "https://partner.visa.com/content/dam/gpp/homepage/card-lab-header-v2-2x.png",
                                ],
                                description: `An amount of ₹${amount} will be credited to your wallet after this payment.`,
                                metadata: {
                                    userId,
                                },
                            },
                            unit_amount: amount * 100,
                        },
                        quantity: 1,
                    },
                ],
                billing_address_collection: "required",
                mode: "payment",
                success_url: `${process.env.CLIENT_URL}/payment-success`,
                cancel_url: `${process.env.CLIENT_URL}/payment-failed`, // check ensure here
            });
            return session;
        });
    }
    paymentSuccess(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = request.body;
            const payloadString = JSON.stringify(payload, null, 2);
            const signature = request.headers["stripe-signature"];
            if (typeof signature !== "string") {
                return false;
            }
            const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
            const header = stripe.webhooks.generateTestHeaderString({
                payload: payloadString,
                secret: endpointSecret,
            });
            let event;
            event = stripe.webhooks.constructEvent(payloadString, header, endpointSecret);
            if (event.type == "charge.succeeded") {
                return true;
            }
            else {
                return false;
            }
        });
    }
    addMoneyToWalletPaymentSuccess(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = request.body;
            const payloadString = JSON.stringify(payload, null, 2);
            const signature = request.headers["stripe-signature"];
            if (typeof signature !== "string") {
                return false;
            }
            const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
            const header = stripe.webhooks.generateTestHeaderString({
                payload: payloadString,
                secret: endpointSecret,
            });
            let event;
            event = stripe.webhooks.constructEvent(payloadString, header, endpointSecret);
            if (event.type == "charge.succeeded") {
                return true;
            }
            else {
                return false;
            }
        });
    }
}
exports.default = PaymentRepository;
