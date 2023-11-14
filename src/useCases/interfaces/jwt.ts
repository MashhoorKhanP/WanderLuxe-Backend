interface JWT {
  generateToken(userId: string): string;
}
export default JWT;
