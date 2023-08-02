import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import Pagination from "@/utils/Pagination";
import Permission from "./permission.model";
const ErrorResponse = require("@/middleware/Error/error.response");

class PermissionRepository {
  constructor() {}

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      await Permission.create(
        {
          ...req.body,
        },
        {
          fields: ["role_id", "access_point_id", "type"],
        }
      );

      res.status(201).json({
        success: true,
        message: "Permission created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  public async find(req: Request, res: Response, next: NextFunction) {
    const pagination = new Pagination(req, res, next);
    const { offset, limit } = pagination.get_attributes();

    pagination.arrange_and_send(
      await Permission.findAndCountAll({
        where: {
          [Op.or]: [
            {
              type: {
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
      var permission = await Permission.findByPk(req.params.id, {});

      if (!permission) return next(new ErrorResponse("No permission found!", 404));

      res.status(201).json({
        success: true,
        message: "Information fetched successfully",
        data: permission,
      });
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id)
        return next(new ErrorResponse("Invalid Request!", 400));

      const { role_id, access_point_id , type} = req.body;

      var permission = await Permission.findByPk(req.params.id, {});

      if (!permission) return next(new ErrorResponse("No permission found!", 404));

      await permission.update({
        role_id,
        access_point_id,
        type,
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
    res.send(`Permission ${req.params.id} Delete API`);
  }
}

export default PermissionRepository;
