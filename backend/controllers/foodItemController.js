import FoodItem from "../models/foodItem.js"
import ErrorHandler from "../utils/errorHandler.js"
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js"
import APIFeatures from "../utils/apiFeatures.js"

export const getAllFoodItems = catchAsyncErrors(async (req, res, next) => {
  let filter = {}
  if (req.params.storeId) {
    filter = { restaurant: req.params.storeId }
  }

  const foodItems = await FoodItem.find(filter).populate("restaurant")
  res.status(200).json({ status: "success", results: foodItems.length, data: foodItems })
})

export const createFoodItem = catchAsyncErrors(async (req, res, next) => {
  const body = { ...req.body }
  if (body.imageUrl) {
    body.images = [{ public_id: "default", url: body.imageUrl }]
    delete body.imageUrl
  }

  const foodItem = await FoodItem.create(body)
  res.status(201).json({ status: "success", data: foodItem })
})

export const getFoodItem = catchAsyncErrors(async (req, res, next) => {
  const foodItem = await FoodItem.findById(req.params.foodId)

  if (!foodItem) return next(new ErrorHandler("No foodItem found with that ID", 404))

  res.status(200).json({ status: "success", data: foodItem })
})

export const updateFoodItem = catchAsyncErrors(async (req, res, next) => {
  const foodItem = await FoodItem.findByIdAndUpdate(req.params.foodId, req.body, {
    new: true,
    runValidators: true,
  })

  if (!foodItem) return next(new ErrorHandler("No document found with that ID", 404))

  res.status(200).json({ status: "success", data: foodItem })
})

export const deleteFoodItem = catchAsyncErrors(async (req, res, next) => {
  const foodItem = await FoodItem.findByIdAndDelete(req.params.foodId)

  if (!foodItem) return next(new ErrorHandler("No document found with that ID", 404))

  res.status(204).json({ status: "success" })
})
