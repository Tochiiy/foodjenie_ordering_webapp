import express from "express"
const router = express.Router({ mergeParams: true })
import { getFoodItem, createFoodItem, getAllFoodItems, deleteFoodItem, updateFoodItem } from "../controllers/foodItemController.js"
import { isAuthenticatedUser } from "../middlewares/auth.js"
import { authorizeRoles } from "../middlewares/authorizeRoles.js"

router.route("/item").post(isAuthenticatedUser, authorizeRoles("admin"), createFoodItem)

router.route("/items/:storeId").get(getAllFoodItems)

router.route("/item/:foodId")
  .get(getFoodItem)
  .patch(isAuthenticatedUser, authorizeRoles("admin"), updateFoodItem)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteFoodItem)

export default router
