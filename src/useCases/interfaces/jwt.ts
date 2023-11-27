interface JWT {
  generateToken(
    _id: string,
    email: string,
    firstName: string,
    lastName: string,
    profileImage: string,
    role:string
  ): string;
}
export default JWT;
