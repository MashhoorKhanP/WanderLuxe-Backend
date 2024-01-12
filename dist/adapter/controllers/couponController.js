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
class CouponController {
    constructor(CouponUseCase) {
        this.CouponUseCase = CouponUseCase;
    }
    //Admin Side
    addCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newCoupon = yield this.CouponUseCase.addCoupon(req.body);
                if (newCoupon) {
                    return res.status(newCoupon.status).json({
                        success: true,
                        result: Object.assign({}, newCoupon.data),
                    });
                }
                else {
                    res.status(400).json({ success: false, result: {} });
                }
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    deleteCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const couponId = req.params.couponId;
                const coupon = this.CouponUseCase.deleteCoupon(couponId);
                return res.status(200).json({
                    success: true,
                    result: { coupon },
                });
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    updateCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const couponId = req.params.couponId;
                const updatedCoupon = yield this.CouponUseCase.updateCoupon(couponId, req.body);
                res.status(200).json({
                    success: true,
                    result: Object.assign({}, updatedCoupon.data),
                });
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    //User side
    getCoupons(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coupons = yield this.CouponUseCase.getCoupons();
                res.status(coupons.status).json({
                    success: true,
                    result: Object.assign({}, coupons.data),
                });
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
}
exports.default = CouponController;
