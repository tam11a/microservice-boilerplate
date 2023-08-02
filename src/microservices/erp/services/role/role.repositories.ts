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

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id)
        return next(new ErrorResponse("Invalid Request!", 400));

      var role = await Role.findByPk(req.params.id, {
        include: ["assigned_employees", "assigned_permissions"],
      });

      if (!role) return next(new ErrorResponse("No role found!", 404));

      // Delete all associated employees and permissions
      await role.$get("assigned_employees");
      await role.$remove("assigned_employees", role.assigned_employees);

    //   await role.$get("assigned_permissions");
    //   await role.$remove("assigned_permissions", role.assigned_permissions);

      // Delete the role
      await role.destroy();

      res.status(200).json({
        success: true,
        message: "Deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default RoleRepository;
