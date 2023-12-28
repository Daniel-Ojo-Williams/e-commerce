import { CustomError, asyncWrapper } from "../utils/index.js";
import Users from "../models/users.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// create user
export const signUp = asyncWrapper(async (req, res) => {
  let { username, password, email, last_name, first_name } = req.body;

  // hash password before saving
  const saltRounds = 10;
  password = await bcrypt.hash(password, saltRounds);

  let newUser = new Users(username, password, email, last_name, first_name);
  const user = await newUser.save();

  // session info
  req.session.userId = user.id;
  req.session.username = user.username;
  req.session.loggedIn = true;

  res
    .status(StatusCodes.CREATED)
    .json({
      data: {
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
});

export const logIn = asyncWrapper(async (req, res) => {
  let { email, password } = req.body;
  const user = await Users.verifyUser(email);
  
  if (!user) {
    throw new CustomError(`User does not exist, create an account to get started`, StatusCodes.BAD_REQUEST);
  }
  
  const passwordMatch = await bcrypt.compare(password, user.password);
  
  if (!passwordMatch) {
    throw new CustomError(`Invalid credentials`, StatusCodes.BAD_REQUEST);
  }
  
  req.session.userId = user.id;
  req.session.username = user.username;
  req.session.loggedIn = true;
  
  res
    .status(StatusCodes.OK)
    .json({
      data: {
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
});

// clear session info when user logs out
export const logOut = asyncWrapper( async ( req, res ) => {
  if(!req.session.loggedIn){
    throw new CustomError('Invalid request, user not logged in', StatusCodes.BAD_REQUEST)
  }
  req.session.userId = '';
  req.session.username = '';
  await req.session.destroy();
  // req.session.loggedIn = false;
  res.send('user logged out')
})


