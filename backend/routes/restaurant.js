import express from "express"
const router = express.Router()
import { createRestaurant, getAllRestaurants, getRestaurant, deleteRestaurant } from "../controllers/restaurantController.js"
import { getMenus, createMenu, addItemToMenu } from "../controllers/menuController.js"

router.get("/", getAllRestaurants)
router.post("/", createRestaurant)

router.get("/:storeId", getRestaurant)
router.delete("/:storeId", deleteRestaurant)
router.get("/:storeId/menus", getMenus)
router.post("/:storeId/menus", createMenu)
router.patch("/:storeId/menus/:menuId/addItem", addItemToMenu)

export default router