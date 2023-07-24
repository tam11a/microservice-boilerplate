import { Request, Response, NextFunction } from "express";

class UserRepository {
	public find(_req: Request, res: Response, _next: NextFunction) {
		res.send("User Find API");
	}

	public delete(req: Request, res: Response, _next: NextFunction) {
		res.send(`User ${req.params.id} Delete API`);
	}
}

export default UserRepository;
