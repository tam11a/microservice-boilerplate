import { Request, Response, NextFunction } from "express";
import Employee from "./employee.model";
import { Op } from "sequelize";
import Pagination from "@/utils/Pagination";

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
            "role",
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
    const pagination = new Pagination(req, res, next);
    const { offset, limit } = pagination.get_attributes();

    pagination.arrange_and_send(
      await Employee.findAndCountAll({
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
      if (!req.params.id)
        return next(new ErrorResponse("No employee found!", 404));

      var employee = await Employee.findByPk(req.params.id, {

        attributes: {
          exclude: ["password"],
        },
      });

      res.status(201).json({
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
            role,
            work_hour,
            salary,
            bank,
            default_address
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
        role,
        work_hour,
        salary,
        bank,
        default_address,
      });

      res.status(200).json({
        success: true,
        message: "Information updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default EmployeeRepository;
