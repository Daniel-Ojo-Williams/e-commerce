import { StatusCodes } from "http-status-codes";
import Products from "../models/products.js";
import asyncWrapper from "../utils/aysncWrapper.js";
import { CustomError } from "../utils/customError.js";

export const addNewProduct = asyncWrapper( async (req, res) => {

  let { name, description, price, quantity, image_url, tags } = req.body;
  let newProduct = new Products(name, description, price, quantity, image_url, tags);

  newProduct = await newProduct.saveProduct();

  res.status(StatusCodes.CREATED).json({data: newProduct});
});

export const getProduct = asyncWrapper( async (req, res) => {
  const productId = req.params.productId;

  const product = await Products.getProduct(productId);
  if (!product){
    throw new CustomError(`Invalid product id: Product with id ${productId} does not exist.`, StatusCodes.BAD_REQUEST);
  }
  res.status(StatusCodes.OK).json({data: product});
});

export const getAllProducts = asyncWrapper( async (req, res) => {
  let offset = 0;
  let fetch = 10; // fetch is the same thing as LIMIT

  // if page is not added in query, it returns a BIGINT error
  let page = req.query?.page;
  if(!page){
    throw new CustomError('Include page number in query', StatusCodes.BAD_REQUEST)
  }

  offset = (parseInt(page) - 1) * fetch;

  const response = await Products.getAllProducts(offset);
  
  let page_count = Math.ceil(response.total / fetch);

  if (page > page_count)
    throw new CustomError(`Max page is ${page_count}`, StatusCodes.BAD_REQUEST);

  res.status(StatusCodes.OK).json({data: response['products'], page: `${page} of ${page_count}`});
});

export const updateProduct = asyncWrapper( async (req, res) => {
  let productId = req.params.productId;
  let keys = "";
  let values = Object.values(req.body);

  Object.keys(req.body).forEach((each, i) => {
    keys += `${each} = $${i + 1}, `;
  });

  keys = keys.slice(0, -2);

  const product = await Products.updateProduct(productId, keys, values);

  if (!product){
    throw new CustomError(`Invalid product id: Product with id ${productId} does not exist.`, StatusCodes.BAD_REQUEST);
  }

  res.status(StatusCodes.OK).json({data: product});
});

export const deleteProduct = asyncWrapper( async (req, res) => {
  let productId = req.params.productId;

  const response = await Products.deleteProduct(productId);

  if (!response){
    throw new CustomError(`Invalid product id: Product with id ${productId} does not exist.`, StatusCodes.BAD_REQUEST);
  }

  res.status(StatusCodes.OK).json({data: `Product deleted successfully`});

});