import { Request, Response, NextFunction } from "express";
import useragent from "useragent";
import geoip from "geoip-lite";
import Employee from "../employee/employee.model";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("@/middleware/Error/error.response");
const { Op } = require("sequelize");
import EmployeeSession from "../session/session.model";

class AuthenticationRepository {
  constructor() {
    this.login = this.login.bind(this);
    this.validate = this.validate.bind(this);
    this.signout = this.signout.bind(this);
  }

  public create_jwt(id: number) {
    return jwt.sign({ id: id, admin: false }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  }

  public async create_session(
    employee_id: number,
    jwt: string,
    req: Request,
    _res: Response,
    next: NextFunction
  ) {
    try {
      // Collect User-Agent
      const agent = useragent.parse(req.headers["user-agent"]);
      // Extract from IP Address in Header to GEO Object - Doesn't work on local server
      const geo = geoip.lookup(
        (
          req.headers["x-forwarded-for"] || // Collect IP Address
          req.socket.remoteAddress ||
          ""
        ).toString()
      );

      const session = {
        jwt,
        employee_id,
        address_details:
          Array.from(new Set([geo?.city, geo?.country]))?.join(", ") || null,
        device_details: JSON.stringify({
          device: agent.device.toString(),
          os: agent.os.toString(),
          browser: agent.toAgent(),
        }),
        user_agent: req.headers["user-agent"],
        ip_address: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        latitude: geo?.ll?.[0] || null,
        longitude: geo?.ll?.[1] || null,
        last_login: new Date(),
      };

      await EmployeeSession.create(
        {
          ...session,
        },
        {
          fields: [
            "jwt",
            "employee_id",
            "address_details",
            "device_details",
            "user_agent",
            "ip_address",
            "latitude",
            "longitude",
            "last_login",
          ],
        }
      );
    } catch (error) {
      next(error);
    }
  }

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

      if (!(await bcrypt.compare(password, employee.password)))
        return next(new ErrorResponse("Incorrect Password", 401));

      // Check out session for available slot
      if (
        (await employee.$count("sessions", {
          where: {
            logged_out_at: {
              [Op.eq]: null,
            },
          },
        })) >= employee.getDataValue("max_session")
      )
        return next(
          new ErrorResponse(
            `You have already signed into ${employee.getDataValue(
              "max_session"
            )} devices. Please logout from other device to continue.`,
            400
          )
        );

      //if (!employee.verified_at)
      //	return next(
      //		new ErrorResponse("Your employee account is not verified yet.", 400)
      //	);

      // Create Token
      const token: string = this.create_jwt(employee.id);

      // Create Session
      await this.create_session(employee.id, token, req, res, next);

      res.status(200).json({
        success: true,
        token,
        message: `Welcome ${employee.getDataValue(
          "first_name"
        )} ${employee.getDataValue("last_name")}!!`,
      });
    } catch (error) {
      next(error);
    }
  }

  //jwt extraction to logout
  public extract_jwt(
    req: Request,
    _res: Response,
    _next: NextFunction
  ): { token: string; decoded: any } {
    var token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) throw new ErrorResponse("Unauthorized employee!", 401);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { token, decoded };
  }

  public async validate(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, decoded } = this.extract_jwt(req, res, next);

      if (!decoded.id)
        return next(new ErrorResponse("Unauthorized employee!", 401));

      var employee = await Employee.findOne({
        where: {
          id: decoded.id,
          is_active: true,
          /* verified_at: {
						[Op.ne]: null,
					}, */
        },
        attributes: {
          exclude: ["password"],
        },
      });

      if (!employee) return next(new ErrorResponse("No employee found!", 404));

      // Check for session expire  //kori nai
      if (
        !!(await employee.$count("sessions", {
          where: {
            jwt: token,
            logged_out_at: {
              [Op.ne]: null,
            },
          },
        }))
      )
        return next(
          new ErrorResponse(
            `This session is signed out. Please sign in again.`,
            401
          )
        );

      res.status(200).json({
        success: true,
        message: "Employee is authenticated.",
        data: employee.dataValues,
      });
    } catch (error) {
      next(error);
    }
  }

  //signout
  public async signout(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = this.extract_jwt(req, res, next);

      const session = await EmployeeSession.findOne({
        where: {
          jwt: token,
        },
      });

      if (session?.getDataValue("logged_out_at") !== null)
        return next(
          new ErrorResponse(`This session is already signed out.`, 401)
        );

      session.logged_out_at = new Date();
      session.save();

      res.status(200).json({
        success: true,
        message: "User logged out successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthenticationRepository;
