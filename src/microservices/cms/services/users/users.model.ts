import { Table, Column, Model, HasMany } from "sequelize-typescript";

@Table
class Person extends Model {
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
}

export default Person;
