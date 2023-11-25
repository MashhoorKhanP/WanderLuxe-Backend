import IAdmin from "../../domain/entities/admin";
import AdminRepo from "../../useCases/interfaces/adminRepo";
import AdminModel from "../database/adminModel";

class AdminRepository implements AdminRepo {
  async findByEmail(email: string): Promise<IAdmin | null> {
    const admin = await AdminModel.findOne({ email });
    return admin;
  }
}

export default AdminRepository;
