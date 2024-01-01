import { StatusCodes } from "http-status-codes";
import Cart from "../models/cart.js";
import { CustomError, asyncWrapper } from "../utils/index.js";
import CartItems from "../models/cartItems.js";

export const createCart = asyncWrapper( async (req, res) => {
  let userId = req.session?.userId;
  console.log(typeof userId);

  let cart = new Cart(userId);
  cart = await cart.createCart();

  res.status(StatusCodes.OK).json({data: cart})
})

export const addItemToCart = asyncWrapper( async (req, res) => {
  let { productId, cartId, quantity } = req.body;
  let newCartItem = new CartItems(productId, cartId, quantity);
  let response = await newCartItem.addItemToCart();
  res.status(StatusCodes.CREATED).json({data: response});
})

export const updateItemQuantity = asyncWrapper( async (req, res) => {
  let { quantity, productId, cartId } = req.body;
  let response = await CartItems.updateProductQuantity(productId, cartId, quantity);

  res.status(StatusCodes.OK).json({data: response});
})

export const removeFromCart = asyncWrapper( async (req, res) => {
  let { productId, cartId } = req.body;
  let response = await CartItems.removeFromCart(productId, cartId);
  if(response !== 1){
    throw new CustomError('Invalid productId or cartId', StatusCodes.BAD_REQUEST);
  }
  res.status(StatusCodes.OK).json({data: response});
})

export const viewCart = asyncWrapper( async (req, res) => {
  let { cartId } = req.body;
  console.log(cartId)
  let { checkout, rows } = await Cart.viewCart(cartId);
  res.status(StatusCodes.OK).json({data: {checkout: checkout[0].checkout, products: rows}});
})

