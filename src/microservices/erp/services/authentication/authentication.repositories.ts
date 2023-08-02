import { Request, Response, NextFunction } from "express";
import Employee from "../employee/employee.model";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("@/middleware/Error/error.response");
const { Op } = require("sequelize");

class AuthenticationRepository {
  constructor() {}

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone, password } = req.body;
      if (!phone || !password)
        return next(
          new ErrorResponse("Please provide phone and password", 400)
        );

      const data = await Employee.findAll({
        where: {
          phone,
        },
      });
      if (!data.length)
        return next(new ErrorResponse("No employee found", 404));

      const employee = data[0];

      if (!employee.is_active)
        return next(
          new ErrorResponse(
            "Your employee account is suspended. Please contact with helpline.",
            400
          )
        );

      //if (!employee.verified_at)
      //	return next(
      //		new ErrorResponse("Your employee account is not verified yet.", 400)
      //	);

      if (!(await bcrypt.compare(password, employee.password)))
        return next(new ErrorResponse("Incorrect Password", 401));

      res.status(200).json({
        success: true,
        token: jwt.sign(
          { id: employee.id, admin: false },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRE,
          }
        ),
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
          // verified_at: {
          //   [Op.ne]: null,
          // },
        },
        attributes: {
          exclude: ["password"],
        },
      });

      // If there's no employee
      if (!employee) return next(new ErrorResponse("No employee found!", 404));

      // get employee role
      const employee_role = await employee.$get("role");

      // get employee permissions with access point
      const employee_permissions = await employee_role?.$get(
        "assigned_permissions",
        {
          include: ["access_point"],
        }
      );

      // re-arrange employee data
      const data = {
        ...employee.dataValues,
        role: {
          id: employee_role?.id,
          name: employee_role?.name,
          description: employee_role?.description,
          is_active: employee_role?.is_active,
        },
        permissions: employee_permissions?.flatMap?.((y: any) => ({
          id: y.id,
          access_point_id: y.access_point_id,
          access_point_name: y.access_point.point_name,
          type: y.type,
        })),
      };

      res.status(200).json({
        success: true,
        message: "Employee is authenticated",
        data,
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
