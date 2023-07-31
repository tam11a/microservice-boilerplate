import { Request, Response, NextFunction } from "express";
import User from "../users/users.model";
import UserSession from "../session/session.model";
import useragent from "useragent";
import geoip from "geoip-lite";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("@/middleware/Error/error.response");
const { Op } = require("sequelize");

class AuthRepository {
  constructor() {
    this.login.bind(this);
  }

  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      await User.create(
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
          ],
        }
      );

      res.status(201).json({
        success: true,
        message: "User created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  private create_jwt(id: number) {
    return jwt.sign({ id: id, admin: false }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  }

  private async create_session(
    user_id: number,
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
        user_id,
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

      await UserSession.create(
        {
          ...session,
        },
        {
          fields: [
            "jwt",
            "user_id",
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
          new ErrorResponse("Please provide phone number and password", 400)
        );

      const data = await User.findAll({
        where: {
          phone,
        },
      });
      if (!data.length) return next(new ErrorResponse("No user found", 404));

      const user = data[0];

      if (!user.is_active)
        return next(
          new ErrorResponse(
            "Your user account is suspended. Please contact with helpline.",
            400
          )
        );

      /* if (!user.verified_at)
          return next(
            new ErrorResponse("Your user account is not verified yet.", 400)
          ); */

      if (!(await bcrypt.compare(password, user.password)))
        return next(new ErrorResponse("Incorrect Password", 401));

      // Create Token
      const token: string = this.create_jwt(user.id);
      // Create Session
      await this.create_session(user.id, token, req, res, next);

      res.status(200).json({
        success: true,
        token,
        message: `Welcome ${user.first_name} ${user.last_name}!!`,
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

    if (!token) return next(new ErrorResponse("Unauthorized user!", 401));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded.id)
        return next(new ErrorResponse("Unauthorized user!", 401));

      var user = await User.findOne({
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

      if (!user) return next(new ErrorResponse("No user found!", 404));

      res.status(200).json({
        success: true,
        message: "User is authenticated.",
        data: user.dataValues,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthRepository;
