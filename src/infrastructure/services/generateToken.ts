import jwt from "jsonwebtoken";
import JWT from "../../useCases/interfaces/jwt";

class JWTToken implements JWT{
  generateToken(_id: string, email: string, firstName: string, lastName: string, profileImage: string): string {
    const KEY = process.env.JWT_SECRET;
          if(KEY){
            const token = jwt.sign({_id,email,firstName,lastName,profileImage},KEY,{expiresIn:'1h'});
            return token;
          }
          throw new Error('JWT key is not found!')
  }
}

export default JWTToken;