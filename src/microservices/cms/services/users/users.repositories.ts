import { Request, Response, NextFunction } from "express";
import User from "./users.model";
import Pagination from "@/utils/Pagination";
const ErrorResponse = require("@/middleware/Error/error.response");
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

	public async findById(req: Request, res: Response, next: NextFunction) {
		try {
			var user = await User.findByPk(req.params.id, {
				attributes: {
					exclude: ["password"],
				},
			});
			if (!user) return next(new ErrorResponse("No user found!", 404));

			res.status(200).json({
				success: true,
				message: "Information fetched successfully",
				data: user,
			});
		} catch (error) {
			next(error);
		}
	}

	public async update(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.params.id)
				return next(new ErrorResponse("Invalid Request!", 400));
			const {
				first_name,
				last_name,
				username,
				gender,
				display_picture,
				email,
				default_address,
				max_session,
			} = req.body;

			var user = await User.findByPk(req.params.id, {});

			if (!user) return next(new ErrorResponse("No user found!", 404));

			await user.update({
				first_name,
				last_name,
				username,
				gender,
				display_picture,
				email,
				default_address,
				max_session,
			});


      res.status(204).json({
        success: true,
        message: "Information updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  public async activeInactive(req: Request, res: Response, next: NextFunction) {
    try {
      var user = await User.findByPk(req.params.id, {});

      if (!user) return next(new ErrorResponse("No user found!", 404));

      await user.update({
        is_active: !user.is_active,
      });
      await user.save();

      res.status(204).json({
        success: true,
        message: `Employee ${
          user.is_active ? "suspended" : "activated"
        } successfully`,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UserRepository;
