import { Request, Response, NextFunction } from "express";
import Pagination from "@/utils/Pagination";
const ErrorResponse = require("@/middleware/Error/error.response");
import { Op } from "sequelize";

import Database from "@/database";
const User = Database.get_model("User");

class UserRepository {
  constructor() {}

  public async find(req: Request, res: Response, next: NextFunction) {
    // Query Props
    const { gender, is_active } = req.query;

    // Pagination, Filter, Search
    const {
      get_attributes,
      get_search_ops,
      format_filters,
      arrange_and_send,
      toBoolean,
    } = new Pagination(req, res, next);

    // Get Props for Query
    const { offset, limit, paranoid } = get_attributes();
    // Get Search Object
    const search_ops = get_search_ops([
      "first_name",
      "last_name",
      "username",
      "phone",
    ]);
    // Get Filter Props
    const filters = format_filters({
      gender,
      is_active: toBoolean(is_active),
    });

    arrange_and_send(
      await User.findAndCountAll({
        where: {
          [Op.or]: search_ops,
          ...filters,
        },
        attributes: {
          exclude: ["password", "default_address"],
          include: [
            [
              Database.sequelize.literal(`(
								SELECT COUNT(*)
								FROM user_session AS session
								WHERE
									session.user_id = User.id
									AND
									session.logged_out_at IS NOT NULL
							)`),
              "active_sessions",
            ],
          ],
        },
        offset,
        limit,
        paranoid, // if False, shows soft-deleted data too
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
        is_active: !user.getDataValue("is_active"),
      });
      await user.save();

      res.status(204).json({
        success: true,
        message: `Employee ${
          user.getDataValue("is_active") ? "suspended" : "activated"
        } successfully`,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UserRepository;
