import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import Pagination from "@/utils/Pagination";
import AccessPoint from "./accesspoint.model";
const ErrorResponse = require("@/middleware/Error/error.response");

class AccessPointRepository {
  constructor() {}

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      await AccessPoint.create(
        {
          ...req.body,
        },
        {
          fields: ["point_name"],
        }
      );

      res.status(201).json({
        success: true,
        message: `New access point ${req.body.point_name} created successfully`,
      });
    } catch (error) {
      next(error);
    }
  }

  public async find(req: Request, res: Response, next: NextFunction) {
    const pagination = new Pagination(req, res, next);
    const { offset, limit } = pagination.get_attributes();

    pagination.arrange_and_send(
      await AccessPoint.findAndCountAll({
        where: {
          [Op.or]: [
            {
              point_name: {
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
      var point = await AccessPoint.findByPk(req.params.id, {});

      if (!point) return next(new ErrorResponse("No point name found!", 404));

      res.status(201).json({
        success: true,
        message: "Information fetched successfully",
        data: point,
      });
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id)
        return next(new ErrorResponse("Invalid Request!", 400));

      const { point_name } = req.body;

      var point = await AccessPoint.findByPk(req.params.id, {});

      if (!point) return next(new ErrorResponse("No point found!", 404));

      await point.update({
        point_name,
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
    res.send(`AccessPoint ${req.params.id} Delete API`);
  }
}

export default AccessPointRepository;
