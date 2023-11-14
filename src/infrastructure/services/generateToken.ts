import jwt from "jsonwebtoken";
import JWT from "../../useCases/interfaces/jwt";

class JWTToken implements JWT{
  generateToken(userId: string): string {
      const KEY = process.env.JWT_SECRET;
      if(KEY){
        const token = jwt.sign({userId},KEY);
        return token;
      }
      throw new Error('JWT key is not found!')
  }
}

export default JWTToken;