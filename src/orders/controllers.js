import { CustomError, asyncWrapper } from '../../utils/index.js';
import CartItems from "../../models/cartItems.js";
import Order from "../../models/orders.js";
import { StatusCodes } from 'http-status-codes';

export const confirmOrder = asyncWrapper(async (req, res) => {
  let cartId = req.session?.cartId;
  let userId = req.session?.userId;

  // recieve delivery address from request body

  // before creating new order make sure cart is not empty
  const cartEmpty = await CartItems.checkCart(cartId);

  if(cartEmpty){
    throw new CustomError('Empty cart, please fill cart to make an order', StatusCodes.BAD_REQUEST);
  }

  const newOrder = new Order(userId, cartId);

  let response = await newOrder.createOrder();

  // clear cart_items after creating order
  await CartItems.clearCart(cartId);

  res.status(StatusCodes.OK).json({ [response]: "order created successfully" });
});

export const updateOrderStatus = asyncWrapper(async(req, res) => {
  let { orderStatus } = req.body;
  let orderId = req.params.orderId;

  let status = ['pending', 'shipped', 'delivered', 'cancelled']

  if(!orderStatus || !status.includes(orderStatus)){
    throw new CustomError('Enter order status to update order status');
  }

  await Order.updateOrderStatus(orderId, orderStatus);

  res.status(StatusCodes.OK).json('successfully updated order status')

})

export const viewOrders = asyncWrapper(async(req, res) => {
  let userId = req.session?.userId;

  let orders = await Order.viewOrders(userId);

  if(orders.length == 0){
    return res.status(StatusCodes.OK).json('No orders found');
  }

  console.log(orders);

  res.status(StatusCodes.OK).json({ orders });
});

export const viewOrderDetails = asyncWrapper(async(req, res) => {
  let orderId = req.params.orderId;

  const details = await Order.viewOrderItems(orderId);

  if(details.length == 0){
    return res.status(StatusCodes.OK).json("Invalid order id provided");
  }

  res.status(StatusCodes.OK).json(details);
})

