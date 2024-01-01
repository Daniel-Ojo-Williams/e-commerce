import express from 'express';
import { addItemToCart, createCart, removeFromCart, updateItemQuantity, viewCart } from './controllers.js';

const router = express.Router();

router.route('/')
.get(createCart)
.post(addItemToCart)
.put(updateItemQuantity)
.delete(removeFromCart);
router.route('/checkout').get(viewCart);

export default router;