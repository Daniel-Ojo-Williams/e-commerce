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
router.route("/increaseProductQuantity").put(increaseProductQuantity);
router.route("/decreaseProductQuantity").put(decreaseProductQuantity);

export default router;
