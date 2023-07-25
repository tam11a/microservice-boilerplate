import { NextFunction, Request, Response } from "express";

const ErrorResponse = require("./error.response");

module.exports = (
	err: Error | any,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	let error = { ...err };
	error.message = err.message || err?.original?.message;
	// console.log(error.message);
	if (err.name?.includes("Sequelize")) {
		var message =
			err?.errors?.[0]?.message || error?.message || "something went wrong";
		error = new ErrorResponse(
			message.replace("must be unique", "already exists"),
			400
		);
	}
	return res.status(error.statusCode || 500).json({
		success: false,
		message: error.message || "Internal Server Error",
	});
};
