import { asyncWrapper, CustomError } from "../utils/index.js";
import Sessions from "../models/session.js";
import { StatusCodes } from "http-status-codes";
import { UAParser } from "ua-parser-js";

const sessionMiddleware = async (req, res, next) => {
  
  let { sid: sessionId } = req.cookies;

  if (!sessionId) {
    return next(new CustomError('No session, please authenticate', StatusCodes.UNAUTHORIZED));
  }
  
  let session = await Sessions.getSession(sessionId);
  if (!session) return next(new CustomError("Session not found, invalid sessionId", StatusCodes.UNAUTHORIZED));

  if(!session.is_valid) return next(new CustomError("Session not valid, please reauthenticate to start a new session", StatusCodes.UNAUTHORIZED));
  
  req.sessionId = session.id;
  req.session = session;

  // update session last_active_at
  const keys = ['last_active_at = $1']; 
  const values = ['now()'];
  await Sessions.updateSession(sessionId, keys, values);

  next();
};

export const createSession = async(req, sessionProps) => {
  try {
    const user_agent = req.headers["user-agent"];
    const parser = new UAParser("user-agent");
    const ip_address = req.ip;
    const os = parser.getOS();
    const device_type = parser.getDevice();
    const browser = parser.getBrowser();
    const refresh_token = sessionProps.refresh_token;
    const refresh_token_exp = sessionProps.refresh_token_exp;
    const user_id = sessionProps.user_id;
    // create a new session
    let session = new Sessions(
      user_id,
      refresh_token,
      refresh_token_exp,
      user_agent,
      ip_address,
      device_type,
      browser,
      os
    );
    return session = await session.createSession();  
  } catch (error) {
    return error.message;
  }
  
}

export default sessionMiddleware;
