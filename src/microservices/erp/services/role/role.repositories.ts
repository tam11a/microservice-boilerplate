import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import Pagination from "@/utils/Pagination";
import Role from "./role.model";
const ErrorResponse = require("@/middleware/Error/error.response");

class RoleRepository {
  constructor() {}

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      await Role.create(
        {
          ...req.body,
        },
        {
          fields: ["name", "description"],
        }
      );

      res.status(201).json({
        success: true,
        message: `${req.body.name} role created successfully`,
      });
    } catch (error) {
      next(error);
    }
  }

  public async find(req: Request, res: Response, next: NextFunction) {
    const pagination = new Pagination(req, res, next);
    const { offset, limit } = pagination.get_attributes();

    pagination.arrange_and_send(
      await Role.findAndCountAll({
        where: {
          [Op.or]: [
            {
              name: {
                [Op.like]: `%${pagination.search_string}%`,
              },
            },
          ],
        },
        offset,
        limit,
      })
    );
  }

  public async findById(req: Request, res: Response, next: NextFunction) {
    try {
      var role = await Role.findByPk(req.params.id, {});

      if (!role) return next(new ErrorResponse("No role found!", 404));

      res.status(201).json({
        success: true,
        message: "Information fetched successfully",
        data: role,
      });
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id)
        return next(new ErrorResponse("Invalid Request!", 400));

      const { name, description } = req.body;

      var role = await Role.findByPk(req.params.id, {});

      if (!role) return next(new ErrorResponse("No role found!", 404));

      await role.update({
        name,
        description,
      });

      res.status(200).json({
        success: true,
        message: "Information updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  public delete(req: Request, res: Response, _next: NextFunction) {
    res.send(`Role ${req.params.id} Delete API`);
  }
}

export default RoleRepository;
