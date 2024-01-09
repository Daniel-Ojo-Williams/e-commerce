import { StatusCodes } from "http-status-codes";
import { CustomError, asyncWrapper } from "../utils/index.js";
import jwt from 'jsonwebtoken'
import RefreshToken from "../models/refreshToken.js";
import bcrypt from 'bcrypt';
import 'dotenv/config.js';
import { GenerateTokenFunction } from "../src/authentication/controller.js";


const refreshToken = async (req, res) => {

  let refresh_token = req.cookies?.refresh_token;

  let refresh_token_hash = await RefreshToken.getReFreshToken(userId);
  if(!refresh_token.expires_in < Date.now()) {
    throw new CustomError('Could not pass access token please authenticate again', StatusCodes.UNAUTHORIZED);
  }

  if(!refresh_token) {
    throw new CustomError('Could not pass access token please authenticate again', StatusCodes.UNAUTHORIZED);
  }
  
  // if refresh token is still valid compare it with the refresh token from the client
  let refresh_token_match = await bcrypt.compare(refresh_token, refresh_token_hash);

  if (!refresh_token_match) {
    throw new CustomError('Could not pass access token please authenticate again', StatusCodes.UNAUTHORIZED);
  }

  return jwt.verify(refresh_token, process.env.JWT_SECRET)
};


const authMiddleWare = async (req, res, next) => {
  try {
    
    let loggedIn = req.session?.loggedIn

    // check if there is access token available
    let access_token = req.cookies?.access_token;
    

    // if access token not available check if refresh token in db is still valid
    if(!access_token) {
      
      const user = refreshToken(req, res);

      if(!user){
        throw new CustomError('Could not pass access token please authenticate again', StatusCodes.UNAUTHORIZED);
      }
      let userId = user?.userId;

      access_token = GenerateTokenFunction(userId, 'access_token');

      res.cookie("access_token", access_token, {
        httpOnly: true,
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
        sameSite: "lax",
      });
    }
    
  

    if(!loggedIn) {
      
      throw new CustomError('Authentication required', StatusCodes.UNAUTHORIZED);
    }
    req.params.id = req.session.userId
    next();

  } catch (error) {
    next(error);
  }
}

export default authMiddleWare;