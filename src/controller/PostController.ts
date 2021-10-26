import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Joi from "joi";
import { validate } from "../util/joiValidate";
import { verify } from "../util/jwt";
import { PostService } from "../service/PostService";

export default class PostController {
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

  async getPost(req: Request, res: Response, next: NextFunction) {
    const { postId } = req.params;
    try {
      const posts = await this.postService.getPost(Number(postId));
      if (!posts) {
        throw createHttpError(400, `유효하지 않은 게시글 번호입니다.`);
      }
      return { posts };
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async getPostList(req: Request, res: Response, next: NextFunction) {
    try {
      const order = req.query.order
        ? String(req.query.order)
        : "createdAt|DESC";
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const offset = req.query.page ? (Number(req.query.page) - 1) * limit : 0;

      const postList = await this.postService.getPostList(order, limit, offset);

      return { count: postList.count, data: postList.rows };
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async updatePost(req: Request, res: Response, next: NextFunction) {
    const paramsSchema = Joi.object().keys({
      postId: Joi.string().required(),
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
      const { postId } = req.params;
      const { title, content } = req.body;

      const posts = await this.postService.getPost(Number(postId));
      if (!posts) {
        throw createHttpError(400, `유효하지 않은 게시글 번호입니다.`);
      }
      const decoded = verify(req.headers.authorization?.split("Bearer ")[1]);
      if (posts.memberId != decoded.id) {
        throw createHttpError(403, `본인 글만 수정할 수 있습니다.`);
      }
      await this.postService.updatePost(Number(postId), title, content);
      res.status(201);
      return { message: "게시글 수정이 완료되었습니다." };
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async deletePost(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object().keys({
      postId: Joi.string().required(),
    });
    try {
      validate(schema, req.params);
      const { postId } = req.params;
      const posts = await this.postService.getPost(Number(postId));
      if (!posts) {
        throw createHttpError(400, `유효하지 않은 게시글 번호입니다.`);
      }
      const decoded = verify(req.headers.authorization?.split("Bearer ")[1]);
      if (posts.memberId != decoded.id) {
        throw createHttpError(403, `본인 글만 수정할 수 있습니다.`);
      }
      await this.postService.deletePost(Number(postId));
      res.status(204);
      return { message: "게시글 삭제가 완료되었습니다." };
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}
