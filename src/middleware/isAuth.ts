import { RequestHandler } from "express";
import createHttpError from "http-errors";
import * as jwt from "jsonwebtoken";
import { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { jwtConfing } from "../config/config";

const isAuth: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (token) {
    jwt.verify(
      token,
      jwtConfing.secretKey,
      (err: VerifyErrors | null, decode: JwtPayload | undefined) => {
        if (err) {
          delete req.session.member;
          throw createHttpError(
            403,
            `유효하지 않은 토큰입니다. 다시 로그인 해주세요.`
          );
        } else {
          next();
        }
      }
    );
  } else {
    throw createHttpError(
      403,
      `유효하지 않은 토큰입니다. 다시 로그인 해주세요.`
    );
  }
};

export default isAuth;
