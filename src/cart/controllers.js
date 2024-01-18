import { StatusCodes } from "http-status-codes";
import Cart from "../../models/cart.js";
import { CustomError, asyncWrapper } from "../../utils/index.js";
import CartItems from "../../models/cartItems.js";

export const addItemToCart = asyncWrapper( async (req, res) => {
  
  let { productId, quantity } = req.body;
  let cartId = req.session?.cartId;
  quantity = quantity || 1;
  console.log(quantity);
  let newCartItem = new CartItems(productId, cartId, quantity);
  let response = await newCartItem.addItemToCart();
  res.status(StatusCodes.CREATED).json({data: response});
})

export const increaseProductQuantity = asyncWrapper( async(res, req) => {
  let { productId } = req.body;
  let cartId = req.session?.cartId;

  let response = await CartItems.increaseProductQuantity(productId, cartId);
  res.status(StatusCodes.OK).json({data: response});
});

export const decreaseProductQuantity = asyncWrapper( async(res, req) => {
  let { productId } = req.body;
  let cartId = req.session?.cartId;

  let response = await CartItems.increaseProductQuantity(productId, cartId);
  res.status(StatusCodes.OK).json({data: response});
});

export const removeFromCart = asyncWrapper( async (req, res) => {
  let { productId, cartId } = req.body;
  let response = await CartItems.removeFromCart(productId, cartId);
  if(response !== 1){
    throw new CustomError('Invalid productId or cartId', StatusCodes.BAD_REQUEST);
  }
  res.status(StatusCodes.OK).json({data: response});
})

export const viewCart = asyncWrapper( async (req, res) => {
  let cartId = req.session?.cartId;
  
  let { summary, rows } = await Cart.viewCart(cartId);
  
  res.status(StatusCodes.OK).json({data: {checkout: summary[0].summary, products: rows}});
})

export const checkout = asyncWrapper( async ( req, res) => {
  // name of the product
  // quantity
  // price_per_unit 
  // total price/summary
  // let {  }
})

