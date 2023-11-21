import IAdmin from "../../domain/entities/admin";

interface AdminRepo {
  findByEmail(email:string): Promise<IAdmin | null>;
}

export default AdminRepo;