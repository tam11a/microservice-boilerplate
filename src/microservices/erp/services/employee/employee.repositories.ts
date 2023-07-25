import { Request, Response, NextFunction } from "express";
import Employee from "./employee.model";

class EmployeeRepository {
  constructor() {}

  //create
  //findandcountall
  //update
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
            "is_active",
            "verified_at",
            "created_at",
            "updated_at",
            "deleted_at",
          ],
        }
      );

      res.status(201).json({
        success: true,
        message: "Employee created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  public async find(_req: Request, res: Response, _next: NextFunction) {
    console.log(await Employee.findOne());
    res.send("Employee Find API");
  }

  public delete(req: Request, res: Response, _next: NextFunction) {
    res.send(`Employee ${req.params.id} Delete API`);
  }
}

export default EmployeeRepository;
