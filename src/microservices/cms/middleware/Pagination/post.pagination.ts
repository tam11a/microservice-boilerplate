import { NextFunction, Request, Response } from "express";

module.exports = (req: Request, res: Response, next: NextFunction) => {
	try {
		const data = req.data;

		res.status(200).json({
			success: true,
			message: "Data fetched sucessfully",
			data: data.rows,
			total: data.count,
			limit: req.pagination.limit,
			page: req.pagination.page,
			hasNextPage:
				Math.ceil(data.count / req.pagination.limit) - req.pagination.page > 0,
			hasPreviousPage: req.pagination.page > 1,
			totalPages: Math.ceil(data.count / req.pagination.limit),
		});

		next();
		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};
