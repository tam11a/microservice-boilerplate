import UserRepository from "./users.repositories";

class UserSchema {
	private repository: any;
	constructor() {
		this.repository = new UserRepository();
	}

	public create_account() {
		return [];
	}

	public find_users() {
		return [this.repository.find];
	}

	public delete_account() {
		return [this.repository.delete];
	}

	public find_by_id() {
		return [];
	}
}

export default UserSchema;
