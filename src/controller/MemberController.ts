import { NextFunction, Request, Response } from "express";
import { MemeberService } from "../service/MemeberService";
import createHttpError from "http-errors";
import Joi from "joi";
import { validate } from "../util/joiValidate";
export default class MainController {
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
      const { email, password, name } = req.body;
      const emailCheck = await this.memeberService.duplicateEmailCheck(email);
      if (emailCheck) {
        throw createHttpError(400, `중복된 이메일 입니다. ${email}`);
      }
      const memberInfo = await this.memeberService.signup(
        email,
        password,
        name
      );
      res.status(201);
      return { message: "등록이 완료되었습니다.", data: memberInfo };
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}
