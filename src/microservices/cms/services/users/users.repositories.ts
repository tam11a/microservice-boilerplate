import { Request, Response, NextFunction } from "express";
import User from "./users.model";
import Pagination from "@/utils/Pagination";
import { Op } from "sequelize";

class UserRepository {
	constructor() {}

	public async find(req: Request, res: Response, next: NextFunction) {
		const pagination = new Pagination(req, res, next);
		const { offset, limit } = pagination.get_attributes();

		pagination.arrange_and_send(
			await User.findAndCountAll({
				where: {
					[Op.or]: [
						{
							first_name: {
								[Op.like]: `%${pagination.search_string}%`,
							},
						},
						{
							last_name: {
								[Op.like]: `%${pagination.search_string}%`,
							},
						},
						{
							username: {
								[Op.like]: `%${pagination.search_string}%`,
							},
						},
						{
							phone: {
								[Op.like]: `%${pagination.search_string}%`,
							},
						},
					],
				},
				attributes: {
					exclude: ["password"],
				},
				offset,
				limit,
			})
		);
	}

	public delete(req: Request, res: Response, _next: NextFunction) {
		res.send(`User ${req.params.id} Delete API`);
	}
}

export default UserRepository;
