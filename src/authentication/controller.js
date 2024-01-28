import {
  CustomError,
  asyncWrapper,
  emailVerification,
} from "../../utils/index.js";
import Users from "../../models/users.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import Cart from "../../models/cart.js";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
import RefreshToken from "../../models/refreshToken.js";
import { createSession } from "../../middlewares/index.js";
import Sessions from "../../models/session.js";

// generate token function
let ACCESSSTOKENEXPIRES = new Date(Date.now() + 1000 * 60 * 60);
let REFRESHTOKENEXPIRES = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
const saltRounds = 10;

export const GenerateTokenFunction = (user, type) => {
  try {
    if (type === "access_token") {
      const token = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: "1hr",
      });
      return token;
    } else {
      const token = jwt.sign({ user }, process.env.JWT_SECRET_REFRESH, {
        expiresIn: `${30 * 24 * 60 * 60 * 1000}ms`
      });
      return token;
    }
  } catch (error) {
    console.log(error.message);
  }
};

// create user
export const signUp = asyncWrapper(async (req, res) => {
  let { username, password, email, last_name, first_name } = req.body;

  // hash password before saving
  const saltRounds = 10;
  password = await bcrypt.hash(password, saltRounds);

  let newUser = new Users(username, password, email, last_name, first_name);
  const user = await newUser.save();

  await emailVerification({ user });

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

  let data = {
    id: user.user_id,
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    cart_id: cart.id,
  };

  // generate access token and refresh token
  const access_token = GenerateTokenFunction(data, "access_token");
  const refresh_token = GenerateTokenFunction(data, "refresh_token");

  // hash refresh token before saving and sending to the frontend
  // let refresh_token_hash = await bcrypt.hash(refresh_token, saltRounds);

  // save refresh token to database
  await RefreshToken.save(
    user.user_id,
    refresh_token,
    REFRESHTOKENEXPIRES
  );

  // create session after user successfully logs in
  const sessionProps = {
    user_id: user.user_id,
    refresh_token: refresh_token,
    refresh_token_exp: REFRESHTOKENEXPIRES,
  };
  const session = await createSession(req, sessionProps);

  // access token is sent to the frontend through Authroization header
  return res
    .cookie("sid", session.sid, {
      expiresIn: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: "strict",
    })
    .header("Authorization", `Bearer ${access_token}`)
    .cookie("refreshToken", refresh_token, {
      httpOnly: true,
      path: "/auth/refresh",
      expires: REFRESHTOKENEXPIRES,
      sameSite: "strict",
    })
    .status(StatusCodes.OK)
    .json({ data });
});

// clear session info when user logs out
export const logOut = asyncWrapper(async (req, res) => {
  const sessionId = req.cookie.sid;
  await Sessions.invalidateSession(sessionId);
  return res
    .clearCookie("sid")
    .clearCookie("refreshToken", { path: "/auth/refresh" })
    .header("Authorization", "")
    .status(StatusCodes.UNAUTHORIZED)
    .json({ message: "Sign out successful" });
});

export const refreshToken = asyncWrapper(async (req, res, next) => {

  const sessionId = req.cookies.sid;
  if (!sessionId)
    return next(new CustomError("Authenticate to get started", StatusCodes.UNAUTHORIZED));

  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return next(
      new CustomError(
        "Could not parse token, please authenticate",
        StatusCodes.UNAUTHORIZED
      )
    );

  // get session from the db and compare refresh token hash

  const session = await Sessions.getSession(sessionId);
  if (!session)
    return next(new CustomError("Authenticate to get started", StatusCodes.UNAUTHORIZED));
  if (!session.is_valid)
    return next(new CustomError("Authenticate to get started", StatusCodes.UNAUTHORIZED));

  // compare the provided refresh token with the refresh token hash
  // const refreshMatch = await bcrypt.compare(
  //   refreshToken,
  //   session.refresh_token
  // );
  const refreshMatch = refreshToken === session.refresh_token;
  console.log(refreshMatch)
  // if not match invalidate/block session for user to reauthenticate
  // - clear out cookies also
  if (!refreshMatch) {
    await Sessions.invalidateSession(sessionId);
    return res
      .clearCookie("sid")
      .clearCookie("refreshToken", { path: "/auth/refresh" })
      .header("Authorization", "")
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Could not parse token, please reauthenticate" });
  }
  // check if refresh_token_exp has passed
  if (session.refresh_token_exp < Date.now())
    return next(
      new CustomError("Could not parse token", StatusCodes.UNAUTHORIZED)
    );

  // decode refresh token
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
  
  let user = decoded.user;

  // if match generate new access token and new refresh token
  const newAccessToken = GenerateTokenFunction(
    user,
    "access_token",
    ACCESSSTOKENEXPIRES
  );
  const newRefreshToken = GenerateTokenFunction(
    user,
    "refresh_token",
    REFRESHTOKENEXPIRES
  );



  // hash and update the refresh token in the session db
  // let newSalt = await bcrypt.genSalt(12)
  // let refresh_token_hash = await bcrypt.hash(newRefreshToken, newSalt);
  const keys = ["refresh_token = $1", "refresh_token_exp = $2"];
  const values = [newRefreshToken, REFRESHTOKENEXPIRES];
  await Sessions.updateSession(sessionId, keys, values);

  return res
    .header("Authorization", `Bearer ${newAccessToken}`)
    .cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      path: "/auth/refresh",
      expires: REFRESHTOKENEXPIRES,
      sameSite: "strict",
    })
    .status(StatusCodes.OK)
    .json("success");
});
