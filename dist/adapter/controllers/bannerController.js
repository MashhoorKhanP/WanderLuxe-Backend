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
class BannerController {
    constructor(BannerUseCase) {
        this.BannerUseCase = BannerUseCase;
    }
    updateBanners(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bannerId = req.params.bannerId;
                const updatedCoupon = yield this.BannerUseCase.updateBanners(bannerId, req.body);
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
    getBanners(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const banners = yield this.BannerUseCase.getBanners();
                res.status(banners.status).json({
                    success: true,
                    result: Object.assign({}, banners.data),
                });
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
}
exports.default = BannerController;
