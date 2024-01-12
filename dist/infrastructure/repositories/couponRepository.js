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
const couponModel_1 = __importDefault(require("../database/couponModel"));
class CouponRepository {
    save(coupon) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("couponRepository", coupon);
            const newCoupon = new couponModel_1.default(coupon);
            yield newCoupon.save();
            return newCoupon;
        });
    }
    findById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const coupon = yield couponModel_1.default.findOne({ _id });
            return coupon;
        });
    }
    findAllCoupons() {
        return __awaiter(this, void 0, void 0, function* () {
            const coupons = yield couponModel_1.default.find({}).sort({ _id: -1 });
            return coupons;
        });
    }
    findAndDeleteCoupon(couponId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedCoupon = yield couponModel_1.default.findByIdAndDelete(couponId);
            if (deletedCoupon) {
                const { _id } = deletedCoupon;
                return _id.toString();
            }
            return null;
        });
    }
    findByIdAndUpdate(_id, reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const coupon = yield couponModel_1.default.findByIdAndUpdate(_id, reqBody, {
                new: true,
            });
            return coupon;
        });
    }
    findByIdAndUpdateCount(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const coupon = yield couponModel_1.default.findByIdAndUpdate(_id, { $inc: { couponCount: -1 } }, // Use $inc to decrease couponCount by 1
            { new: true });
            return coupon;
        });
    }
}
exports.default = CouponRepository;
