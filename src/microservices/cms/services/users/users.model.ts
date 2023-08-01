import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Unique,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  AllowNull,
  BeforeUpdate,
  BeforeCreate,
  IsEmail,
  Default,
  HasMany,
} from "sequelize-typescript";
import UserSession from "../session/session.model";
const bcrypt = require("bcryptjs");

@Table({
  tableName: "user",
})
class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  "id": number;

  @Column
  "first_name": string;

  @Column
  "last_name": string;

  @Unique
  @Column
  "username": string;

  @AllowNull
  @Column
  "password": string;

  @Column(DataType.ENUM("Male", "Female", "Non Binary"))
  "gender": string;

  @AllowNull
  @Column
  "display_picture": string;

  @Unique
  @AllowNull
  @IsEmail
  @Column
  "email": string;

  @Unique
  @Column
  "phone": string;

  @AllowNull
  @Column
  "default_address": string;

  @Default(true)
  @Column
  "is_active": boolean;

  @AllowNull
  @Column
  "verified_at": Date;

  @HasMany(() => UserSession)
  "sessions": UserSession[];

  @CreatedAt
  @Column({ field: "created_at" })
  "created_at": Date;

  @UpdatedAt
  @Column({ field: "updated_at" })
  "updated_at": Date;

  @DeletedAt
  @Column({ field: "deleted_at" })
  "deleted_at": Date;

  @BeforeUpdate
  @BeforeCreate
  static async hashPassword(instance: User) {
    if (instance.changed("password")) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(instance.password, salt);
      instance.password = hashedPassword;
    }
  }
}

export default User;
