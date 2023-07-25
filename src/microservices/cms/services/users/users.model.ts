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

	@AllowNull
	@Column
	"default_address": string;

	@Default(true)
	@Column
	"is_active": boolean;

	@Default(false)
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

	@BeforeUpdate
	@BeforeCreate
	static hashPassword(_instance: User) {
		console.log(
			"Have to hash password if it is updated or created with password"
		);
	}
}

export default User;
