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
class BannerUseCase {
    constructor(BannerRepository) {
        this.BannerRepository = BannerRepository;
    }
    updateBanners(bannerId, reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedBanner = yield this.BannerRepository.findByIdAndUpdate(bannerId, reqBody);
            if (updatedBanner) {
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: updatedBanner,
                    },
                };
            }
            else {
                return {
                    status: 400,
                    data: {
                        success: false,
                        message: `Updating Banner failed`,
                    },
                };
            }
        });
    }
    //User side
    getBanners() {
        return __awaiter(this, void 0, void 0, function* () {
            const banners = yield this.BannerRepository.findAllBanners();
            return {
                status: 200,
                data: {
                    success: true,
                    message: banners,
                },
            };
        });
    }
}
exports.default = BannerUseCase;
