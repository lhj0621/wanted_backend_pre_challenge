import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Joi from "joi";
import { validate } from "../util/joiValidate";
import { verify } from "../util/jwt";
import { PostsService } from "../service/PostsService";

export default class PostsController {
  private postsService = new PostsService();
  async writePosts(req: Request, res: Response, next: NextFunction) {
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
      const postsInfo = await this.postsService.writePosts(
        decoded.id,
        title,
        content
      );
      res.status(201);
      return { data: postsInfo };
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async getPosts(req: Request, res: Response, next: NextFunction) {
    const { postsId } = req.params;
    try {
      const posts = await this.postsService.getPosts(Number(postsId));
      if (!posts) {
        throw createHttpError(400, `유효하지 않은 게시글 번호입니다.`);
      }
      return { posts };
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async getPostsList(req: Request, res: Response, next: NextFunction) {
    try {
      const order = req.query.order
        ? String(req.query.order)
        : "createdAt|DESC";
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const offset = req.query.page ? (Number(req.query.page) - 1) * limit : 0;

      const postsList = await this.postsService.getPostsList(order, limit, offset);

      return { count: postsList.count, data: postsList.rows };
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async updatePosts(req: Request, res: Response, next: NextFunction) {
    const paramsSchema = Joi.object().keys({
      postsId: Joi.string().required(),
    });
    const bodySchema = Joi.object()
      .keys({
        title: Joi.string().required(),
        content: Joi.string().required(),
      })
      .unknown();
    try {
      validate(paramsSchema, req.params);
      validate(bodySchema, req.body);
      const { postsId } = req.params;
      const { title, content } = req.body;

      const posts = await this.postsService.getPosts(Number(postsId));
      if (!posts) {
        throw createHttpError(400, `유효하지 않은 게시글 번호입니다.`);
      }
      const decoded = verify(req.headers.authorization?.split("Bearer ")[1]);
      if (posts.memberId != decoded.id) {
        throw createHttpError(403, `본인 글만 수정할 수 있습니다.`);
      }
      await this.postsService.updatePosts(Number(postsId), title, content);
      res.status(201);
      return { message: "게시글 수정이 완료되었습니다." };
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async deletePosts(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object().keys({
      postsId: Joi.string().required(),
    });
    try {
      validate(schema, req.params);
      const { postsId } = req.params;
      const posts = await this.postsService.getPosts(Number(postsId));
      if (!posts) {
        throw createHttpError(400, `유효하지 않은 게시글 번호입니다.`);
      }
      const decoded = verify(req.headers.authorization?.split("Bearer ")[1]);
      if (posts.memberId != decoded.id) {
        throw createHttpError(403, `본인 글만 삭제할 수 있습니다.`);
      }
      await this.postsService.deletePosts(Number(postsId));
      res.status(204);
      return { message: "게시글 삭제가 완료되었습니다." };
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}
