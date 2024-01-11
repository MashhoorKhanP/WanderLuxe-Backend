import BannerRepository from "../infrastructure/repositories/bannerRepository";

class BannerUseCase {
  private BannerRepository: BannerRepository;

  constructor(BannerRepository: BannerRepository) {
    this.BannerRepository = BannerRepository;
  }

  async updateBanners(bannerId: string, reqBody: object) {
    const updatedBanner = await this.BannerRepository.findByIdAndUpdate(
      bannerId,
      reqBody
    );
    if (updatedBanner) {
      return {
        status: 200,
        data: {
          success: true,
          message: updatedBanner,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          success: false,
          message: `Updating Banner failed`,
        },
      };
    }
  }

  //User side
  async getBanners() {
    const banners = await this.BannerRepository.findAllBanners();
    return {
      status: 200,
      data: {
        success: true,
        message: banners,
      },
    };
  }
}

export default BannerUseCase;
