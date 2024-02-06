import { StatusCodes } from "http-status-codes";
import { CustomError, asyncWrapper } from "../utils/index.js";
import jwt, { decode } from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config.js";
import { GenerateTokenFunction } from "../src/authentication/controller.js";
import "dotenv/config.js";

const authMiddleWare = asyncWrapper(async (req, res, next) => {
  // check for session id in cookie
  let sessionId = req.cookies.sid;
  if (!sessionId)
    return next(new CustomError("Session not found", StatusCodes.UNAUTHORIZED));

  // check if there is access token available in authorization header
  let authHeader = req.headers["authorization"].split(" ");
  let access_token = authHeader[1];

  if (!access_token)
    return next(
      new CustomError(
        "No access token, Authentication required",
        StatusCodes.UNAUTHORIZED
      )
    );

  // verify access_token
  let user;
  try {
    const decoded = jwt.verify(access_token, process.env.JWT_SECRET)
    console.log(decoded)
    user = decoded.user;
    
  } catch (error) {
    if(error.message == 'jwt expired') return next(new CustomError('TokenExpiredError', StatusCodes.UNAUTHORIZED));
  }
    

  
  // passess the user object decoded from the access token to the next endpoint
  req.user = user;
  next();
});

export default authMiddleWare;



// check for session id and access token
// if no session id, request authentication
// if session id, check for access_token
// if no access token, request authentication
// if access_token is expired, check for refresh_token
// if refresh_token, generate new access_token and refresh_token

// Check for session ID:
//     If no session ID, request authentication.
//     If session ID found, validate it against the database:
//         If valid, retrieve associated session data (including user_id).
//         If invalid or missing user_id, treat as no session and request authentication.

// Check for access token:
//     If no access token, request authentication.
//     If access token found, check expiration:
//         If expired, proceed to refresh token logic.
//         If not expired, validate token signature/claims (optional) and use for authorization.

// Refresh token logic:
//     If refresh token found, generate new access token and refresh token.
//         Invalidate old refresh token in the database.
//         Store new refresh token with updated expiration.
//         Consider rate limiting or other security measures.
