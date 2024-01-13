import { CustomError, asyncWrapper } from "../../utils/index.js";
import Users from "../../models/users.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import Cart from "../../models/cart.js";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
import RefreshToken from "../../models/refreshToken.js";
import nodemailer from "nodemailer";

// generate token function
export const GenerateTokenFunction = (userId, type) => {
  try {
    if (type === "access_token") {
      const token = jwt.sign({ userId }, process.env.JWT_SECRET);
      return token;
    } else {
      const token = jwt.sign({ userId }, process.env.JWT_SECRET_REFRESH);
      return token;
    }
  } catch (error) {
    console.log(error.message);
  }
};

// email sender authentication
let transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// email verification function
const emailVerification = asyncWrapper(async (user) => {
  // generate verification token with user_id
  let token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
  let link = `http://localhost:3000/verify/${token}`;
  let message = {
    from: "freakydmuse@gmail.com",
    to: user.email,
    subject: "E-commerce App: Welcome to E-commerce App",
    html: `<p>Welcome to E-commerce App ${user.first_name + ' ' + user.last_name}</p><br/><p>Here is your verification link, click <a href=${link} >here<a/> to verify. The link expires in 10 minutes.</p>`,
  };

  try {
    const response = await transporter.sendMail(message);
    
  } catch (error) {
    
    throw new CustomError('Sorry an error occurred while registering, please try again')
  }
});

// verify token from email
export const emailTokenVerification = asyncWrapper(async (req, res) => {
  const { token } = req.params;
  
  if(!token){
    throw new CustomError('Sorry an error occurred, could not parse token');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  let userId = decoded.userId;
  await Users.verifyEmail(userId);
  
  res.send('Account verified successfully');
});

// create user
export const signUp = asyncWrapper(async (req, res) => {
  let { username, password, email, last_name, first_name } = req.body;

  // hash password before saving
  const saltRounds = 10;
  password = await bcrypt.hash(password, saltRounds);

  let newUser = new Users(username, password, email, last_name, first_name);
  const user = await newUser.save();

  await emailVerification(user);

  res.status(StatusCodes.CREATED).json({
    data: {
      message: "User created successfully",
    },
  });
});

export const logIn = asyncWrapper(async (req, res) => {
  let { email, password } = req.body;
  const user = await Users.verifyUser(email);

  if (!user) {
    throw new CustomError(
      `User does not exist, create an account to get started`,
      StatusCodes.BAD_REQUEST
    );
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new CustomError(`Invalid credentials`, StatusCodes.BAD_REQUEST);
  }

  // Get user cart id from database
  let cart = await Cart.getCartId(user.user_id);

  // generate access token and refresh token
  const access_token = GenerateTokenFunction(user.user_id, "access_token");
  let refresh_token = GenerateTokenFunction(user.user_id, "refresh_token");

  // hash refresh token before saving
  const saltRounds = 10;
  let refresh_token_hash = await bcrypt.hash(refresh_token, saltRounds);
  let refreshTokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 5);

  // save refresh token to database
  await RefreshToken.save(
    user.user_id,
    refresh_token_hash,
    refreshTokenExpires
  );

  res.cookie("access_token", access_token, {
    httpOnly: true,
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
    sameSite: "lax",
  });

  res.cookie("refresh_token", refresh_token, {
    httpOnly: true,
    path: "/",
    expires: refreshTokenExpires,
    sameSite: "lax",
  });

  req.session.userId = user.user_id;
  req.session.username = user.username;
  req.session.cartId = cart.id;
  req.session.loggedIn = true;

  res.status(StatusCodes.OK).json({
    data: {
      id: user.user_id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      cart_id: cart.id,
    },
  });
});

// clear session info when user logs out
export const logOut = asyncWrapper(async (req, res) => {
  if (!req.session.loggedIn) {
    throw new CustomError(
      "Invalid request, user not logged in",
      StatusCodes.BAD_REQUEST
    );
  }

  await req.session.destroy();
  // req.session.loggedIn = false;
  res.send("user logged out");
});
