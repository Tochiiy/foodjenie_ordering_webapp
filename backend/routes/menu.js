import express from "express"
const router = express.Router({ mergeParams: true })
import { getAllMenus, createMenu, deleteMenu, addItemToMenu } from "../controllers/menuController.js"
import { isAuthenticatedUser } from "../middlewares/auth.js"
import { authorizeRoles } from "../middlewares/authorizeRoles.js"

router.route("/").get(getAllMenus).post(isAuthenticatedUser, authorizeRoles("admin"), createMenu)

router.route("/:menuId/addItem").patch(isAuthenticatedUser, authorizeRoles("admin"), addItemToMenu)

router.route("/:menuId").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteMenu)

export default router
