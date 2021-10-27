import { NextFunction, Request, Response } from "express";
import { MemeberService } from "../service/MemeberService";
import createHttpError from "http-errors";
import Joi from "joi";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { jwtConfing } from "../config/config";
import { validate } from "../util/joiValidate";

export default class MemberController {
  private memeberService = new MemeberService();

  async renderMain(req: Request, res: Response, next: NextFunction) {
    console.log("MainController");
    return { render: "index" };
  }

  async signup(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object()
      .keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
        name: Joi.string().required(),
      })
      .unknown();
    try {
      validate(schema, req.body);
      const { email, name } = req.body;
      let { password } = req.body;
      const duplicateEmailCheck = await this.memeberService.findMemberByEmail(
        email
      );
      if (duplicateEmailCheck) {
        throw createHttpError(
          400,
          `이미 가입되어 있는 이메일 입니다. ${email}`
        );
      }
      password = await bcrypt.hash(password, 10);
      const memberInfo = await this.memeberService.signup(
        email,
        password,
        name
      );
      res.status(201);
      return { message: "가입이 완료되었습니다.", data: memberInfo };
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
  async signin(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object()
      .keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
      })
      .unknown();
    try {
      validate(schema, req.body);
      const { email, password } = req.body;
      const memberInfo = await this.memeberService.findMemberByEmail(email);
      if (!memberInfo) {
        throw createHttpError(400, "존재하지 않는 아이디입니다.");
      }
      const same = bcrypt.compareSync(password, memberInfo.password);
      if (!same) {
        throw createHttpError(401, "틀린 비밀번호 입니다.");
      }
      const token = jwt.sign(
        {
          id: memberInfo.id,
          email: memberInfo.email,
          name: memberInfo.name,
        },
        jwtConfing.secretKey,
        {
          expiresIn: "1day",
        }
      );
      await this.memeberService.saveMemberSession(req, memberInfo);
      return { token };
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}
