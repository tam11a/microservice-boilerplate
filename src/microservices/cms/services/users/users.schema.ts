import { findUsers } from "./controllers/find_users.controller";

class UserSchema {
	public create_account() {
		return [];
	}

	public find_users() {
		return [findUsers];
	}

	public delete_account() {
		return [];
	}

	public find_by_id() {
		return [];
	}
}

export default UserSchema;
