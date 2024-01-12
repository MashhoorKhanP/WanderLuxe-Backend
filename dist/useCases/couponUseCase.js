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
class CouponUseCase {
    constructor(CouponRepository) {
        this.CouponRepository = CouponRepository;
    }
    //Admin side
    addCoupon(coupon) {
        return __awaiter(this, void 0, void 0, function* () {
            if (coupon) {
                yield this.CouponRepository.save(Object.assign({}, coupon));
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: coupon,
                    },
                };
            }
            else {
                return {
                    status: 400,
                    data: {
                        status: false,
                        success: false,
                        message: "Something went wrong in adding the coupon!",
                    },
                };
            }
        });
    }
    deleteCoupon(couponId) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = yield this.CouponRepository.findAndDeleteCoupon(couponId);
            return {
                status: 200,
                data: {
                    success: true,
                    message: _id,
                },
            };
        });
    }
    updateCoupon(couponId, reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedCoupon = yield this.CouponRepository.findByIdAndUpdate(couponId, reqBody);
            if (updatedCoupon) {
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: updatedCoupon,
                    },
                };
            }
            else {
                return {
                    status: 400,
                    data: {
                        success: false,
                        message: `Updating coupon failed`,
                    },
                };
            }
        });
    }
    //User side
    getCoupons() {
        return __awaiter(this, void 0, void 0, function* () {
            const coupons = yield this.CouponRepository.findAllCoupons();
            return {
                status: 200,
                data: {
                    success: true,
                    message: coupons,
                },
            };
        });
    }
}
exports.default = CouponUseCase;
