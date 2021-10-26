import { sequelize as sequelizeModel } from "../model/index";
import sequelize from "sequelize";
import { Post } from "../model/data/Post";
import { Member } from "../model/data/Member";
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

  public async getPost(portId: number): Promise<Post | null> {
    const postInfo = await Post.findOne({
      attributes: [
        "id",
        "memberId",
        "title",
        "content",
        "createdAt",
        "updatedAt",
      ],
      where: { id: portId },
      include: [
        {
          model: Member,
          attributes: ["name"],
        },
      ],
    });

    return postInfo;
  }

  public async getPostList(
    order: string,
    limit: number,
    offset: number
  ): Promise<{ rows: Post[]; count: number }> {
    const orderArr = order.split("|");
    const PostList = await Post.findAndCountAll({
      attributes: [
        "id",
        "memberId",
        "title",
        "content",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Member,
          attributes: ["name"],
        },
      ],
      limit,
      offset,
      order: [[orderArr[0], orderArr[1]]],
      distinct: true,
    });
    return PostList;
  }

  public async updatePost(
    id: number,
    title: string,
    content: string
  ): Promise<void> {
    await Post.update({ title, content }, { where: { id } });
  }
}
