import express from 'express';
import {
  confirmOrder,
  viewOrderDetails,
  viewOrders,
  updateOrderStatus,
} from "./controllers.js";

const router = express.Router();

router.route('/confirmOrder').post(confirmOrder);
router.route('/updateOrderStatus').post(updateOrderStatus);
router.route('/').get(viewOrders);
router.route('/:orderId').get(viewOrderDetails);
export default router;