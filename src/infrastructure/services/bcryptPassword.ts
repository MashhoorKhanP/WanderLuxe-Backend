import bcrypt from 'bcrypt';
import Hashpassword from '../../useCases/interfaces/hashPassword';

class Encrypt implements Hashpassword {
  async generateHash(password: string): Promise<string> {
    if (!password) {
      throw new Error('Invalid password');
    }
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password,salt);
      return hashedPassword;
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
      const match = await bcrypt.compare(password, hashedPassword);
      return match;
  }
}

export default Encrypt;