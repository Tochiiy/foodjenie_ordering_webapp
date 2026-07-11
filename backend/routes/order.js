import express from "express"
const router = express.Router()
import {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js"
import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js"

router.use(isAuthenticatedUser)

router.get("/admin/all", authorizeRoles("admin"), getAllOrders)
router.put("/admin/:id", authorizeRoles("admin"), updateOrderStatus)

router.route("/").post(createOrder).get(getMyOrders)
router.get("/:id", getOrder)

export default router
