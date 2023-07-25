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
} from "sequelize-typescript";

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

	@Column
	"username": string;

	@Column
	"gender": string;

	@Column
	"display_picture": string;

	@Column
	"email": string;

	@Column
	"phone": string;

	@Column
	"default_address": string;

	@Column
	"is_active": boolean;

	@Column
	"is_verified": boolean;

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

export default User;
