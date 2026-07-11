import ErrorHandler from "../utils/errorHandler.js"
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js"
import Menu from "../models/menu.js"
import FoodItem from "../models/foodItem.js"

export const getMenus = catchAsyncErrors(async (req, res, next) => {
  const menus = await Menu.find({ restaurant: req.params.storeId }).populate({
    path: "menu.items",
    model: "FoodItem"
  })

  if (!menus || menus.length === 0) {
    return res.status(200).json({
      status: "Success",
      data: []
    })
  }

  res.status(200).json({
    status: "Success",
    data: menus
  })
})

export const createMenu = catchAsyncErrors(async (req, res, next) => {
  const menu = await Menu.create(req.body)

  res.status(201).json({
    status: "Success",
    data: menu
  })
})

export const getAllMenus = catchAsyncErrors(async (req, res, next) => {
  const menus = await Menu.find({ restaurant: req.params.storeId }).populate({
    path: "menu.items",
    model: "FoodItem"
  })

  res.status(200).json({ status: "Success", count: menus.length, data: menus })
})

export const deleteMenu = catchAsyncErrors(async (req, res, next) => {
  const menu = await Menu.findByIdAndDelete(req.params.menuId)

  if (!menu) {
    return next(new ErrorHandler("Menu not found", 404))
  }

  res.status(200).json({ status: "Success", message: "Menu deleted" })
})

export const addItemToMenu = catchAsyncErrors(async (req, res, next) => {
  const { category, foodItemId } = req.body

  const menu = await Menu.findById(req.params.menuId)

  if (!menu) {
    return next(new ErrorHandler("Menu not found", 404))
  }

  const categoryIndex = menu.menu.findIndex(c => c.category === category)

  if (categoryIndex === -1) {
    return next(new ErrorHandler(`Category "${category}" not found in menu`, 404))
  }

  menu.menu[categoryIndex].items.push(foodItemId)
  await menu.save()

  await FoodItem.findByIdAndUpdate(foodItemId, { menu: req.params.menuId })

  res.status(200).json({
    status: "Success",
    data: menu
  })
})
