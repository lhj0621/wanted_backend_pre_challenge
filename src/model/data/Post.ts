import {
  Table,
  Column,
  Model,
  AllowNull,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Member } from "./Member";

@Table({
  modelName: "post",
  paranoid: true,
  timestamps: true,
  charset: "utf8mb4",
  collate: "utf8mb4_general_ci",
  freezeTableName: true,
})
export class Post extends Model {
  @ForeignKey(() => Member)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  memberId!: number;

  @BelongsTo(() => Member)
  member!: Member;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(60),
  })
  title!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(500),
  })
  content!: string;
}
