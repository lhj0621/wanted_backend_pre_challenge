import { sequelize as sequelizeModel } from "../model/index";
import sequelize from "sequelize";
import { Post } from "../model/data/Post";
const Op = sequelize.Op;

export class PostService {
  public async writePost(
    memberId: number,
    title: string,
    content: string
  ): Promise<Post> {
    return await Post.create({
      memberId,
      title,
      content,
    });
  }
}
