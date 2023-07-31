import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  AllowNull,
  BeforeUpdate,
  BeforeCreate,
  IsEmail,
  Default,
} from "sequelize-typescript";
const bcrypt = require("bcryptjs");

@Table({
  tableName: "role",
})
class Role extends Model<Role> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  "id": number;

  @Column
  "name": string;

  @AllowNull
  @Column
  "description": string;

  @Default(true)
  @Column
  "is_active": boolean;

  @CreatedAt
  @Column({ field: "created_at" })
  "created_at": Date;

  @UpdatedAt
  @Column({ field: "updated_at" })
  "updated_at": Date;

  @DeletedAt
  @Column({ field: "deleted_at" })
  "deleted_at": Date;

}

export default Role;
