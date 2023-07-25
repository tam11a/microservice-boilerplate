import { Request, Response, NextFunction } from "express";
import User from "./users.model";

class UserRepository {
	constructor() {}

	public async find(_req: Request, res: Response, _next: NextFunction) {
		console.log(await User.findOne());
		res.send("User Find API");
	}

	public delete(req: Request, res: Response, _next: NextFunction) {
		res.send(`User ${req.params.id} Delete API`);
	}
}

export default UserRepository;
