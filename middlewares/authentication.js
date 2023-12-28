import { StatusCodes } from "http-status-codes";
import { CustomError, asyncWrapper } from "../utils/index.js";


const authMiddleWare = (req, res, next) => {
  try {
    
    let loggedIn = req.session?.loggedIn

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