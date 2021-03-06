import { Request } from "express";
import { Member } from "../model/data/Member";
export class MemeberService {
  public async findMemberByEmail(email: string): Promise<Member | null> {
    return await Member.findOne({
      attributes: ["id", "email", "password", "name", "createdAt"],
      where: { email },
    });
  }

  public async signup(
    email: string,
    password: string,
    name: string
  ): Promise<Member> {
    return await Member.create({
      email: email,
      password: password,
      name: name,
    });
  }

  public async saveMemberSession(req: Request, member: Member): Promise<void> {
    member.password = "******";
    req.session.member = member;
  }
}
