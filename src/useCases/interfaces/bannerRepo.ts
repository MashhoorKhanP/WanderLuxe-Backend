import IBanners from "../../domain/entities/banner";

interface BannerRepo {
  findByIdAndUpdate(_id: string, reqBody: object): Promise<IBanners | null>;
  findAllBanners(): Promise<{}[] | null>;
}

export default BannerRepo;
