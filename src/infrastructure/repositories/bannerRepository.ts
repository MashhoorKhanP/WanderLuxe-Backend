import IBanners from "../../domain/entities/banner";
import BannerRepo from "../../useCases/interfaces/bannerRepo";
import BannerModel from "../database/bannerModel";

class BannerRepository implements BannerRepo {
  async findByIdAndUpdate(
    _id: string,
    reqBody: object
  ): Promise<IBanners | null> {
    const banner = await BannerModel.findByIdAndUpdate(_id, reqBody, {
      new: true,
    });
    return banner;
  }

  async findAllBanners(): Promise<{}[] | null> {
    const banners = await BannerModel.find({});
    return banners;
  }
}

export default BannerRepository;
