import { StatusCodes } from "http-status-codes";
import { CustomError } from "../utils/index.js";

const validateAuthBody = (req, res, next) => {
  try {
    let { username, password, last_name, first_name, email } = req.body;
    if (!password) {
      throw new CustomError(
        "Enter password to register",
        StatusCodes.BAD_REQUEST
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      throw new CustomError(
        "Please enter a valid email address",
        StatusCodes.BAD_REQUEST
      );
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{6,}$/;

    if (!passwordRegex.test(password)) {
      throw new CustomError(
        "Invalid password format, password muust be at least 6 characters long, contain at least one uppercase letter, one special character and digit",
        StatusCodes.BAD_REQUEST
      );
    }

    if (req.path === "/auth/login") {
      next();
    }

    if (!username || username.length < 5) {
      throw new CustomError(
        "Username must be at least 5 characters long",
        StatusCodes.BAD_REQUEST
      );
    }

    if (!last_name || !first_name) {
      throw new CustomError(
        "Please enter first name and last name to sign up.",
        StatusCodes.BAD_REQUEST
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default validateAuthBody;
