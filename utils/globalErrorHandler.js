import { StatusCodes } from "http-status-codes";

function globalErrorHandler(error, req, res, next){

  let statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  let message = error.message || 'Internal Server Error: Sorry an error has occurred'
  return res.status(statusCode).json(message)
}

export default globalErrorHandler