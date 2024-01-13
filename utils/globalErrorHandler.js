import { StatusCodes } from "http-status-codes";

function globalErrorHandler(error, res){
  
  let statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  let message = error.message || 'Internal Server Error: Sorry an error has occurred'
  if(error.constraint == 'unique_email'){
    const email = error.detail.split('=')[1].split(' ')[0]
    message = `An account with this email address ${email} already exists. Please try again.`
  }
  if(error.message == 'jwt expired'){
    message = `Could not parse token, Token expired. Please try again.`
  }
  
  return res.status(statusCode).json(message)
}

export default globalErrorHandler