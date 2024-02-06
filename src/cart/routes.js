import express from "express";
import {
  addItemToCart,
  removeFromCart,
  increaseProductQuantity,
  decreaseProductQuantity,
  viewCart,
} from "./controllers.js";

const router = express.Router();

router.route("/").get(viewCart).post(addItemToCart).delete(removeFromCart);
router.route("/increaseQuantity").put(increaseProductQuantity);
router.route("/decreaseQuantity").put(decreaseProductQuantity);

export default router;
