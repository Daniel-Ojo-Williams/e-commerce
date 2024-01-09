import express from 'express';
import { addItemToCart, removeFromCart, increaseProductQuantity, decreaseProductQuantity, viewCart } from './controllers.js';

const router = express.Router();

router.route('/')
.post(addItemToCart)
.delete(removeFromCart);
router.route('/increaseProductQuantity').put(increaseProductQuantity);
router.route('/decreaseProductQuantity').put(decreaseProductQuantity);
router.route('/checkout').get(viewCart);

export default router;