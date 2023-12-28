import { StatusCodes } from "http-status-codes";
import Cart from "../models/cart.js";
import { asyncWrapper } from "../utils/index.js";

export const createCart = asyncWrapper( async (req, res) => {
  let userId = req.session?.userId;
  console.log(typeof userId);

  let cart = new Cart(userId);
  cart = await cart.createCart();

  res.status(StatusCodes.OK).json({data: cart})
})

export const addItemToCart = asyncWrapper( async (req, res) => {
  // let { productId, quantity, price }
})