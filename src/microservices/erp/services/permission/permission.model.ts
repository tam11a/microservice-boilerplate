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
  BelongsTo,
  ForeignKey,
  AllowNull,
} from "sequelize-typescript";
import Role from "../role/role.model";
import AccessPoint from "../accesspoint/accesspoint.model";

@Table({
  tableName: "permission",
})
class Permission extends Model<Permission> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  "id": number;

  @Column(DataType.ENUM("create", "read", "update", "delete"))
  "type": string;

  @CreatedAt
  @Column({ field: "created_at" })
  "created_at": Date;

  @UpdatedAt
  @Column({ field: "updated_at" })
  "updated_at": Date;

  @DeletedAt
  @Column({ field: "deleted_at" })
  "deleted_at": Date;

  // Relations between tables
  @ForeignKey(() => Role)
  @AllowNull
  @Column(DataType.BIGINT)
  "role_id": number;

  @BelongsTo(() => Role)
  "role": Role;

  @ForeignKey(() => AccessPoint)
  @AllowNull
  @Column(DataType.BIGINT)
  "access_point_id": number;

  @BelongsTo(() => AccessPoint)
  "access_point": AccessPoint;
}

export default Permission;
