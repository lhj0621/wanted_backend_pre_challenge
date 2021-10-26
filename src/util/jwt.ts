import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { jwtConfing } from "../config/config";

export const verify = (token: string | undefined): any => {
  return jwt.verify(String(token), jwtConfing.secretKey);
};
