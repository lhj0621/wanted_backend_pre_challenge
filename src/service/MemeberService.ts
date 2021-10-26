import { sequelize as sequelizeModel } from "../model/index";
import sequelize from "sequelize";
import { Member } from "../model/data/Member";
const Op = sequelize.Op;

export class MemeberService {
  public async duplicateEmailCheck(email: string): Promise<Member | null> {
    return await Member.findOne({
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
}
