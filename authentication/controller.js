import { CustomError, asyncWrapper } from "../utils/index.js";
import Users from "../models/users.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { request } from "express";

// create user
export const createUser = asyncWrapper(async (req, res) => {
  let { username, password, email, last_name, first_name } = req.body;

  // hash password before saving
  const saltRounds = 10;
  password = await bcrypt.hash(password, saltRounds);

  let newUser = new Users(username, password, email, last_name, first_name);
  const result = await newUser.save();
  res.status(StatusCodes.CREATED).json(result);
});

// get a single user profile
export const getUSer = asyncWrapper(async (req, res) => {
  let userId = req.params.userId;
  const user = await Users.getUser(userId);
  res.status(StatusCodes.OK).json({ data: user });
});

// get all users
export const getAllUsers = asyncWrapper(async (req, res) => {
  let offset = 0;
  let fetch = 5;
  let page = req.query?.page;

  offset = (parseInt(page) - 1) * fetch;

  const users = await Users.getAllUsers(offset, fetch);

  let page_count = Math.ceil(users.total / fetch);

  if (page > page_count)
    throw new CustomError(`Max page is ${page_count}`, StatusCodes.BAD_REQUEST);

  res
    .status(StatusCodes.OK)
    .json({ data: users["users"], pages: `Page: ${page} of ${page_count}` });
});

// update user
export const updateUser = asyncWrapper(async (req, res) => {
  let userId = req.params.userId;
  let keys = "";
  let values = Object.values(req.body);

  Object.keys(req.body).forEach((each, i) => {
    keys += `${each} = $${i + 1}, `;
  });

  keys = keys.slice(0, -2);

  const user = await Users.updateUser(userId, keys, values);
  res.status(StatusCodes.OK).json({data: user});
});

// delete user
export const deleteUser = asyncWrapper(async (req, res) => {
  const userId = req.params.userId;

  await Users.deleteUser(userId);
  res.status(StatusCodes.OK).json({data: 'User deleted successfully'})
});
