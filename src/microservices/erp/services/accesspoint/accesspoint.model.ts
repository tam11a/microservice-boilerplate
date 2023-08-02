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
  HasMany,
} from "sequelize-typescript";
import Permission from "../permission/permission.model";

@Table({
  tableName: "accesspoint",
})
class AccessPoint extends Model<AccessPoint> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  "id": number;

  @Column
  "point_name": string;

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
  @HasMany(() => Permission)
  "assigned_permissions": Permission[];
}

export default AccessPoint;
