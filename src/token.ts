import jwt from "jsonwebtoken";

const tokenSecret = "this is an exposed secret";

export function generateToken(userData: object) {
  return jwt.sign(userData, tokenSecret);
}
