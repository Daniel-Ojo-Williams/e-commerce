import { StatusCodes } from "http-status-codes";
import Users from "../../models/users.js";
import {
  asyncWrapper,
  CustomError,
  emailVerification as sendMail,
} from "../../utils/index.js";
import { redisClient as Redis } from "../../utils/sessionStorage.js";
import bcrypt from 'bcrypt';

export const sendOTP = asyncWrapper(async (req, res) => {
  // get user email to reset password
  const email = req.body.email;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    throw new CustomError(
      "Please enter a valid email address",
      StatusCodes.BAD_REQUEST
    );
  }

  // check if email exists in db
  const emailExists = await Users.verifyUser(email);

  if (!emailExists) {
    throw new CustomError(
      "Account with email not found, please try again",
      StatusCodes.NOT_FOUND
    );
  }

  // generate otp
  let otp = "";

  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10);
  }

  // create a redis key anmd value with email and otp
  const response = await Redis.set(email, otp);
  
  let secondsToExpire = 60;
  // send otp to email address
  let content = `<p>Here is your OTP to reset your password, it expires in <b>${secondsToExpire} seconds</b></p><br><h2>${otp}</h2>`;
  let title = "Reset Password";
  let subject = "Reset Password OTP";

  await sendMail({ email, content, title, subject });
  await Redis.expire(email, secondsToExpire);

  res.cookie("user", { userId: emailExists.user_id, email }, {
    expires: new Date(Date.now() + (1000 * 60 * 10)),
    httpOnly: true,
  });
  res.status(StatusCodes.OK).json("Check email for code ");
});

export const verifyOTP = asyncWrapper(async (req, res) => {
  const { otp } = req.body;
  let user = req.cookies?.user;

  if (!user) {
    throw new CustomError("Session expired", StatusCodes.UNAUTHORIZED);
  }

  let email = user.email;
  

  if (!otp || !email) {
    throw new CustomError("Invalid request 1", StatusCodes.NOT_FOUND);
  }

  let value = await Redis.get(email);
  

  if (!value) {
    throw new CustomError("Invalid request 2", StatusCodes.NOT_FOUND);
  }
  
  if (otp != value) {
    throw new CustomError("Wrong token provided", StatusCodes.NOT_ACCEPTABLE);
  }

  res.status(StatusCodes.OK).json("Successfull");

  await Redis.del(email);
});

export const resetPassword = asyncWrapper(async (req, res) => {
  let user = req.cookies?.user;

  if (!user) {
    throw new CustomError("Session expired", StatusCodes.UNAUTHORIZED);
  }

  let newPassword = req.body?.newPassword;

  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{6,}$/;

  if (!passwordRegex.test(newPassword) || !newPassword) {
    throw new CustomError(
      "Invalid password format, password muust be at least 6 characters long, contain at least one uppercase letter, one special character and digit",
      StatusCodes.BAD_REQUEST
    );
  }


  // update password in db
  let saltRounds = 10;
  let password = await bcrypt.hash(newPassword, saltRounds);
  
  let keys = `password = $1`
  await Users.updateUser(user.userId, keys, [password]);

  res.status(StatusCodes.OK).json('Success');
});
