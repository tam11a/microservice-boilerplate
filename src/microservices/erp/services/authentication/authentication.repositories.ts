import { Request, Response, NextFunction } from "express";
import Employee from "../employee/employee.model";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("@/middleware/Error/error.response");
const { Op } = require("sequelize");

class AuthenticationRepository {
	constructor() {}

	// public async register(req: Request, res: Response, next: NextFunction) {
	// 	try {
	// 		await Employee.create(
	// 			{
	// 				...req.body,
	// 			},
	// 			{
	// 				fields: [
	// 					"first_name",
	// 					"last_name",
	// 					"username",
	// 					"password",
	// 					"gender",
	// 					"display_picture",
	// 					"email",
	// 					"phone",
	// 				],
	// 			}
	// 		);

	// 		res.status(201).json({
	// 			success: true,
	// 			message: "Employee created successfully",
	// 		});
	// 	} catch (error) {
	// 		next(error);
	// 	}
	// }

	public async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { phone, password } = req.body;
			if (!phone || !password)
				return next(
					new ErrorResponse("Please provide email and password", 400)
				);

			const data = await Employee.findAll({
				where: {
					phone,
				},
			});
			if (!data.length) return next(new ErrorResponse("No employee found", 404));

			const employee = data[0];

			if (!employee.is_active)
				return next(
					new ErrorResponse(
						"Your employee account is suspended. Please contact with helpline.",
						400
					)
				);

			if (!employee.verified_at)
				return next(
					new ErrorResponse("Your employee account is not verified yet.", 400)
				);

			if (!(await bcrypt.compare(password, employee.password)))
				return next(new ErrorResponse("Incorrect Password", 401));

			res.status(200).json({
				success: true,
				token: jwt.sign({ id: employee.id, admin: false }, process.env.JWT_SECRET, {
					expiresIn: process.env.JWT_EXPIRE,
				}),
				message: `Welcome ${employee.first_name} ${employee.last_name}!!`,
			});
		} catch (error) {
			next(error);
		}
	}

	public async validate(req: Request, res: Response, next: NextFunction) {
		let token;

		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer")
		) {
			token = req.headers.authorization.split(" ")[1];
		}

		if (!token) return next(new ErrorResponse("Unauthorized employee!", 401));

		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			if (!decoded.id)
				return next(new ErrorResponse("Unauthorized employee!", 401));

			var employee = await Employee.findOne({
				where: {
					id: decoded.id,
					is_active: true,
					verified_at: {
						[Op.ne]: null,
					},
				},
			});

			if (!employee) return next(new ErrorResponse("No employee found!", 404));

			res.status(200).json({
				success: true,
				message: "Employee is authenticated.",
				data: {
					id: employee.id,
					first_name: employee.first_name,
					last_name: employee.last_name,
					username: employee.username,
					gender: employee.gender,
					display_picture: employee.display_picture,
					email: employee.email,
					phone: employee.phone,
					dob: employee.dob,
					hired_date: employee.hired_date,
					role: employee.role,
					work_hour: employee.work_hour,
					salary: employee.salary,
					bank: employee.bank,
					default_address: employee.default_address,
					is_active: employee.is_active,
					verified_at: employee.verified_at,
					created_at: employee.created_at,
					updated_at: employee.updated_at,
					deleted_at: employee.deleted_at,
				},
			});
		} catch (error) {
			next(error);
		}
	}
}

/*
"id": 7,
        "first_name": "Ibrahim Sadik",
        "last_name": "Tamim",
        "username": "tam11a",
        "password": "$2a$10$vcP.DbbKKV/Ca2qNd.Jcg.QPVvj.aKQamZm1lN3O06PiqIozeF5Bq",
        "gender": "Male",
        "display_picture": null,
        "email": "ibrahimsadiktamim@gmail.com",
        "phone": "01768161994",
        "default_address": null,
        "is_active": true,
        "is_verified": false,
        "created_at": "2023-07-25T18:04:55.000Z",
        "updated_at": "2023-07-25T18:04:55.000Z",
        "deleted_at": null
*/
export default AuthenticationRepository;
