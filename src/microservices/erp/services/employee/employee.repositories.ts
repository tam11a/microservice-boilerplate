import { Request, Response, NextFunction } from "express";
import Employee from "./employee.model";
import { Op } from "sequelize";
import Pagination from "@/utils/Pagination";
import Role from "../role/role.model";
const bcrypt = require("bcryptjs");
const ErrorResponse = require("@/middleware/Error/error.response");

class EmployeeRepository {
  constructor() {}

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      await Employee.create(
        {
          ...req.body,
        },
        {
          fields: [
            "first_name",
            "last_name",
            "username",
            "password",
            "gender",
            "display_picture",
            "email",
            "phone",
            "dob",
            "hired_date",
            "role_id",
            "work_hour",
            "salary",
            "bank",
            "default_address",
          ],
        }
      );

      res.status(201).json({
        success: true,
        message: `${req.body.first_name} registered as an employee successfully`,
      });
    } catch (error) {
      next(error);
    }
  }

  public async find(req: Request, res: Response, next: NextFunction) {
    // Query Props
    const { role_id } = req.query;

    // Pagination, Filter, Search
    const { get_attributes, get_search_ops, format_filters, arrange_and_send } =
      new Pagination(req, res, next);

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
      role_id,
    });

    arrange_and_send(
      await Employee.findAndCountAll({
        where: {
          [Op.or]: search_ops,
          ...filters,
        },
        include: {
          model: Role,
          as: "role",
          attributes: ["id", "name"],
        },
        offset,
        limit,
        paranoid, // if False, shows soft-deleted data too
      })
    );
  }

  public async findById(req: Request, res: Response, next: NextFunction) {
    try {
      var employee = await Employee.findByPk(req.params.id, {
        attributes: {
          exclude: ["password"],
        },
      });

      if (!employee) return next(new ErrorResponse("No employee found!", 404));

      res.status(200).json({
        success: true,
        message: "Information fetched successfully",
        data: employee,
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
        dob,
        hired_date,
        role_id,
        work_hour,
        salary,
        bank,
        default_address,
      } = req.body;

      var employee = await Employee.findByPk(req.params.id, {});

      if (!employee) return next(new ErrorResponse("No employee found!", 404));

      await employee.update({
        first_name,
        last_name,
        username,
        gender,
        display_picture,
        email,
        dob,
        hired_date,
        role_id,
        work_hour,
        salary,
        bank,
        default_address,
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
      var employee = await Employee.findByPk(req.params.id, {});

      if (!employee) return next(new ErrorResponse("No employee found!", 404));

      await employee.update({
        is_active: !employee.is_active,
      });
      await employee.save();

      res.status(200).json({
        success: true,
        message: `Employee ${
          employee.is_active ? "suspended" : "activated"
        } successfully`,
      });
    } catch (error) {
      next(error);
    }
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { password, new_password } = req.body;
      // Find the employee by id
      const employee = await Employee.findByPk(req.params.id);

      // If the employee does not exist, return an error.
      if (!employee) {
        return res.status(404).json({ error: "Employee not found." });
      }

      // Check if the old password matches the stored password
      if (!(await bcrypt.compare(password, employee.password)))
        return next(new ErrorResponse("Incorrect Password", 401));

      // Update the employee's password with the new password
      await employee.update({ password: new_password });

      res.status(200).json({
        success: true,
        message: "Password reset successful.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default EmployeeRepository;
