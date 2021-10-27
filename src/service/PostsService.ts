import { Post } from "../model/data/Post";
import { Member } from "../model/data/Member";

export class PostsService {
  public async writePosts(
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

  public async getPosts(portId: number): Promise<Post | null> {
    const postsInfo = await Post.findOne({
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

    return postsInfo;
  }

  public async getPostsList(
    order: string,
    limit: number,
    offset: number
  ): Promise<{ rows: Post[]; count: number }> {
    const orderArr = order.split("|");
    const PostsList = await Post.findAndCountAll({
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
    return PostsList;
  }

  public async updatePosts(
    id: number,
    title: string,
    content: string
  ): Promise<void> {
    await Post.update({ title, content }, { where: { id } });
  }

  public async deletePosts(id: number): Promise<void> {
    await Post.destroy({ where: { id } });
  }
}
