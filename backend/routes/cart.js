import express from "express"
const router = express.Router()
import {
  addToCart,
  getCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart
} from "../controllers/cartController.js"

import { isAuthenticatedUser } from "../middlewares/auth.js"

router.use(isAuthenticatedUser)

router.route("/").post(addToCart).get(getCart)
router.route("/item/:foodItemId").put(updateCartItemQuantity).delete(removeFromCart)
router.route("/clear/:restaurantId").delete(clearCart)

export default router