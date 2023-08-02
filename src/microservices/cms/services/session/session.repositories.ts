import { Request, Response, NextFunction } from "express";
// import Session from "./session.model";
import Pagination from "@/utils/Pagination";
const ErrorResponse = require("@/middleware/Error/error.response");

import Database from "@/database";
import { Op } from "sequelize";

const Session = Database.get_model("UserSession");

class SessionRepository {
	constructor() {}

	public async find(req: Request, res: Response, next: NextFunction) {
		// Query Props
		const { user_id } = req.query;

		// Pagination, Filter, Search
		const { get_attributes, get_search_ops, format_filters, arrange_and_send } =
			new Pagination(req, res, next);

		// Get Props for Query
		const { offset, limit, paranoid } = get_attributes();
		// Get Search Object
		const search_ops = get_search_ops(["user_agent"]);
		// Get Filter Props
		const filters = format_filters({
			user_id,
		});

		arrange_and_send(
			await Session.findAndCountAll({
				where: {
					[Op.or]: search_ops,
					...filters,
				},
				offset,
				limit,
				paranoid, // if False, shows soft-deleted data too
			})
		);
	}

	public async findById(req: Request, res: Response, next: NextFunction) {
		try {
			var session = await Session.findByPk(req.params.id, {
				attributes: {
					exclude: ["password"],
				},
			});
			if (!session) return next(new ErrorResponse("No session found!", 404));

			res.status(200).json({
				success: true,
				//message: "Information fetched successfully",
				data: session,
			});
		} catch (error) {
			next(error);
		}
	}
}

export default SessionRepository;
