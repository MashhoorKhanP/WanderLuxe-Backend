interface Hashpassword {
  generateHash(password: string): Promise<string>;
  compare(password: string, hashedPassword: string): Promise<boolean>;
}

export default Hashpassword;
