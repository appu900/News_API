import prisma from "../DB/db.config.js";
import vine, { errors } from "@vinejs/vine";
import {
  registerSchema,
  userLoginSchema,
} from "../validations/AuthValidation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AuthController {
  static async register(request, response) {
    const body = request.body;
    try {
      const validator = vine.compile(registerSchema);
      const payload = await validator.validate(body);

      //   check email is unique or not

      const findUser = await prisma.users.findUnique({
        where: {
          email: payload.email,
        },
      });

      if (findUser) {
        return response.status(400).json({
          status: "error",
          message: "Email already exists",
        });
      }

      const salt = bcrypt.genSaltSync(10);
      payload.password = bcrypt.hashSync(payload.password, salt);

      const user = await prisma.users.create({ data: payload });

      return response.status(200).json({
        status: "success",
        message: "User registered successfully",
        data: user,
      });
    } catch (error) {
      console.log("the error is " + error);

      if (error instanceof errors.E_VALIDATION_ERROR) {
        // console.log(error.messages);
        return response.status(400).json({
          status: "error",
          message: error.messages,
        });
      } else {
        return response.status(500).json({
          status: "error",
          message: "Something went wrong",
        });
      }
    }
  }

  static async login(request, response) {
    const body = request.body;
    try {
      const validator = vine.compile(userLoginSchema);
      const payload = await validator.validate(body);

      const findUser = await prisma.users.findUnique({
        where: {
          email: payload.email,
        },
      });

      if (!findUser) {
        return response.status(400).json({
          status: "error",
          message: "No user found with this email",
        });
      }

      if (!bcrypt.compareSync(payload.password, findUser.password)) {
        return response.status(400).json({
          status: "error",
          message: "Invalid password",
        });
      }

      //   issue a token to user

      const tokenPayloadData = {
        id: findUser.id,
        name: findUser.name,
        email: findUser.email,
        profile: findUser.profile,
      };

      const token = jwt.sign(tokenPayloadData, process.env.JWT_SECRET,{
        expiresIn:"3d"
      });

      return response.status(200).json({
        status: "success",
        message: "User logged in successfully",
        access_token:`Bearer ${token}`,
      });

    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(400).json({
          status: "error",
          message: error.messages,
        });
      } else {
        return response.status(500).json({
          status: "error",
          message: "Something went wrong",
        });
      }
    }
  }
}

export default AuthController;
