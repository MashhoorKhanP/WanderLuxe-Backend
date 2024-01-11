import mongoose, { Document, Model, Schema } from "mongoose";
import IBanners from "../../domain/entities/banner";

const bannerSchema: Schema = new Schema<IBanners & Document>(
  {
    images: { type: [String], default: [""] },
    text: { type: String, default: "Your Ultimate Staycation Destination..." },
  },
  {
    timestamps: true,
  }
);

const BannerModel: Model<IBanners & Document> = mongoose.model<
  IBanners & Document
>("Banner", bannerSchema);

export default BannerModel;
