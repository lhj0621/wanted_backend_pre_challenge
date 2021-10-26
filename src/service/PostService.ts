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
}
