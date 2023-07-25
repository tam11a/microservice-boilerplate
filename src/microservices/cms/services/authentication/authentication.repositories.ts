import { Request, Response, NextFunction } from "express";
import User from "../users/users.model";

class UserRepository {
	constructor() {}

	public async register(req: Request, res: Response, next: NextFunction) {
		try {
			const {
				first_name,
				last_name,
				username,
				password,
				gender,
				display_picture,
				email,
				phone,
			} = req.body;

			res.json({
				// first_name,
				// last_name,
				// username,
				// password,
				// gender,
				// display_picture,
				// email,
				// phone,
				...req.body,
			});
		} catch (error) {
			next(error);
		}
	}

	public async login(_req: Request, res: Response, _next: NextFunction) {
		// console.log(await User.findOne());
		res.send("User Find API");
	}

	public async validate(req: Request, res: Response, _next: NextFunction) {
		res.send(`User ${req.params.id} Delete API`);
	}
}

export default UserRepository;
