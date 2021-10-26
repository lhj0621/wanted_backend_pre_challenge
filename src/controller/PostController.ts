import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Joi from "joi";
import { validate } from "../util/joiValidate";
import { verify } from "../util/jwt";
import { PostService } from "../service/PostService";

export default class MainController {
  private postService = new PostService();
  async writePost(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object()
      .keys({
        title: Joi.string().required(),
        content: Joi.string().required(),
      })
      .unknown();
    try {
      validate(schema, req.body);
      const { title, content } = req.body;
      const decoded = verify(req.headers.authorization?.split("Bearer ")[1]);
      const postInfo = await this.postService.writePost(
        decoded.id,
        title,
        content
      );
      return { data: postInfo };
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}
