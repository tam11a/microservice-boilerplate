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
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Role from "../role/role.model";
const bcrypt = require("bcryptjs");

@Table({
  tableName: "employee",
})
class Employee extends Model<Employee> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  "id": number;

  @Column
  "first_name": string;

  @Column
  "last_name": string;

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

  @AllowNull
  @IsEmail
  @Column
  "email": string;

  @Column
  "phone": string;

  @Column
  "dob": string;

  @Column
  "hired_date": string;

  @Column
  "work_hour": string;

  @Column
  "salary": string;

  @Column
  "bank": string;

  @AllowNull
  @Column
  "default_address": string;

  @Default(true)
  @Column
  "is_active": boolean;

  @AllowNull
  @Column
  "verified_at": Date;

  @CreatedAt
  @Column({ field: "created_at" })
  "created_at": Date;

  @UpdatedAt
  @Column({ field: "updated_at" })
  "updated_at": Date;

  @DeletedAt
  @Column({ field: "deleted_at" })
  "deleted_at": Date;

  // Relations
  @ForeignKey(() => Role)
  @AllowNull
  @Column(DataType.BIGINT)
  "role_id": number;

  @BelongsTo(() => Role)
  "role": Role;

  //hooks
  @BeforeUpdate
  @BeforeCreate
  static async hashPassword(instance: Employee) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(instance.password, salt);
    instance.password = hashedPassword;
  }
}

export default Employee;
