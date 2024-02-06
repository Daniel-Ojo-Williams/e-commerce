import { StatusCodes } from "http-status-codes";
import { CustomError } from "../utils/index.js";

const validateProductBody = (req, res, next) => {
  try {

    if(req.method === 'GET' || req.method === 'DELETE'){
      next();
    }

    let { name, description, price, quantity, image_url, tags,  } = req.body;
    
    if (!name) {
      throw new CustomError(
        "Enter product name to register new product",
        StatusCodes.BAD_REQUEST
      );
    }

    if (!description || description.length > 255) {
      throw new CustomError(
        "Please enter product description not more than 255 characters.",
        StatusCodes.BAD_REQUEST
      );
    }


    if (!price) {
      throw new CustomError(
        "Enter product price to register product",
        StatusCodes.BAD_REQUEST
      );
    }

    if(typeof price !== 'float' || price < 1.00) {
      throw new CustomError('Enter a valid price, price should be a float type i.e. $32.00 or $11.53', StatusCodes.BAD_REQUEST);
    }

    price = parseFloat(price);


    if (!quantity) {
      throw new CustomError(
        "Please enter the amount of the product availalble",
        StatusCodes.BAD_REQUEST
      );
    }

    if(typeof quantity !== 'integer' || quantity < 1){
      throw new CustomError(
        'Please enter a valid quantity, quantity should be an integer', StatusCodes.BAD_REQUEST
      )
    }

    if (!image_url || !Array.isArray(image_url)) {
      throw new CustomError(
        "Please enter image urls in an array",
        StatusCodes.BAD_REQUEST
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default validateProductBody;
