import { redisClient as Redis } from "../utils/sessionStorage.js";

const MINUTES_IN_A_WINDOW = 60000;
const REQUEST_PER_WINDOW = 5;

const rateLimiter = (identifier='') => {
  return async (req, res, next) => {
    try {
      const user = identifier || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const currentTime = Date.now();
    

      const result = await Redis.hGetAll(user);
      
      if(Object.keys(result).length == 0){
        await Redis.hSet(user, 'createdAt', currentTime);
        await Redis.hSet(user, 'count', 1)

        return next();

      }
      
      let diff = currentTime - parseInt(result.createdAt);

      if(diff > MINUTES_IN_A_WINDOW){
        await Redis.hSet(user, 'createdAt', currentTime);
        await Redis.hSet(user, 'count', 1);
        
        return next();
      }

      if(parseInt(result.count) < REQUEST_PER_WINDOW){
        await Redis.hIncrBy(user, 'count', 1);
        
        return next();

      }else{
        
        return res.status(429).json('Too many requests, please try again later');
      }
      
    } catch (error) {
      console.log(error.message);
    }
  }
}

export default rateLimiter;