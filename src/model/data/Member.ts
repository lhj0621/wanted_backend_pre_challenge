import {
  Table,
  Column,
  Model,
  AllowNull,
  DataType,
  HasMany,
} from "sequelize-typescript";
import { Post } from "./Post";

@Table({
  modelName: "member",
  paranoid: true,
  timestamps: true,
  charset: "utf8mb4",
  collate: "utf8mb4_general_ci",
  freezeTableName: true,
})
export class Member extends Model {
  @AllowNull(false)
  @Column({
    type: DataType.STRING(30),
  })
  email!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
  })
  password!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(30),
  })
  name!: string;

  @HasMany(() => Post)
  post!: Post[];
}
