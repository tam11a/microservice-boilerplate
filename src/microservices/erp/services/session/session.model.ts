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
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import Employee from "../employee/employee.model";

@Table({
  tableName: "employee_session",
})
class EmployeeSession extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  "id": number;

  @ForeignKey(() => Employee)
  @AllowNull
  @Column(DataType.BIGINT)
  "employee_id": number;

  @BelongsTo(() => Employee)
  "employee": Employee;

  @Column
  "jwt": string;

  @AllowNull
  @Column
  "ip_address": string;

  @AllowNull
  @Column
  "address_details": string;

  @AllowNull
  @Column
  "device_details": string;

  @AllowNull
  @Column
  "user_agent": string;

  @AllowNull
  @Column
  "latitude": number;

  @AllowNull
  @Column
  "longitude": number;

  @AllowNull
  @Column
  "last_login": Date;

  @AllowNull
  @Column
  "logged_out_at": Date;

  @CreatedAt
  @Column({ field: "created_at" })
  "logged_in_at": Date;

  @UpdatedAt
  @Column({ field: "updated_at" })
  "updated_at": Date;

  @DeletedAt
  @Column({ field: "deleted_at" })
  "deleted_at": Date;
}

export default EmployeeSession;
