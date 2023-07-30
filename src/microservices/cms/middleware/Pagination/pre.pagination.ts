import { Request, Response, NextFunction } from "express";

const { literal } = require("sequelize");

module.exports = (req: Request, _res: Response, next: NextFunction) => {
	const { search, limit, page, sort } = req.query;

	req.search = search || "";
	req.pagination = {
		limit: limit && parseInt(limit) ? parseInt(limit) : 10,
		page: page && parseInt(page) > 1 ? parseInt(page) : 1,
		skip:
			((page && parseInt(page) > 1 ? parseInt(page) : 1) - 1) *
			(limit && parseInt(limit) ? parseInt(limit) : 10),
		order: (literalFields = []) =>
			Array.from(sort?.replaceAll(" ", "")?.split(",") || [], (s) =>
				s[0] === "-"
					? [
							literalFields.includes(s.replace("-", ""))
								? literal(s.replace("-", ""))
								: s.replace("-", ""),
							"ASC",
					  ]
					: [literalFields.includes(s) ? literal(s) : s, "DESC"]
			),
	};

	next();
};
