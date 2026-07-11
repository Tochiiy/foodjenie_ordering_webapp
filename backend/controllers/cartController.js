import ErrorHandler from "../utils/errorHandler.js"
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js"
import Cart from "../models/cartModel.js"
import FoodItem from "../models/foodItem.js"
import Restaurant from "../models/restaurant.js"

export const addToCart = catchAsyncErrors(async (req, res, next) => {
  const { foodItemId, quantity, restaurantId } = req.body
  const userId = req.user.id

  const foodItem = await FoodItem.findById(foodItemId)
  if (!foodItem) {
    return next(new ErrorHandler("Food item not found", 404))
  }

  if (foodItem.stock < quantity) {
    return next(new ErrorHandler("Insufficient stock", 400))
  }

  let cart = await Cart.findOne({ user: userId, restaurant: restaurantId })

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      restaurant: restaurantId,
      foodItems: [{ foodItem: foodItemId, quantity }]
    })
  } else {
    const existingItemIndex = cart.foodItems.findIndex(
      item => item.foodItem.toString() === foodItemId
    )

    if (existingItemIndex > -1) {
      cart.foodItems[existingItemIndex].quantity += quantity
    } else {
      cart.foodItems.push({ foodItem: foodItemId, quantity })
    }
    await cart.save()
  }

  cart = await Cart.findById(cart._id).populate("foodItems.foodItem")

  res.status(200).json({
    status: "Success",
    data: cart
  })
})

export const getCart = catchAsyncErrors(async (req, res, next) => {
  const { restaurantId } = req.query
  const userId = req.user.id

  const query = { user: userId }
  if (restaurantId) query.restaurant = restaurantId

  const cart = await Cart.findOne(query).populate("foodItems.foodItem").populate("restaurant")

  if (!cart) {
    return res.status(200).json({
      status: "Success",
      data: { user: userId, restaurant: restaurantId, foodItems: [] }
    })
  }

  res.status(200).json({
    status: "Success",
    data: cart
  })
})

export const updateCartItemQuantity = catchAsyncErrors(async (req, res, next) => {
  const { foodItemId } = req.params
  const { quantity } = req.body
  const userId = req.user.id

  if (quantity < 1) {
    return next(new ErrorHandler("Quantity must be at least 1", 400))
  }

  const foodItem = await FoodItem.findById(foodItemId)
  if (!foodItem) {
    return next(new ErrorHandler("Food item not found", 404))
  }

  if (foodItem.stock < quantity) {
    return next(new ErrorHandler("Insufficient stock", 400))
  }

  const cart = await Cart.findOne({ user: userId, restaurant: foodItem.restaurant })
  if (!cart) {
    return next(new ErrorHandler("Cart not found", 404))
  }

  const itemIndex = cart.foodItems.findIndex(
    item => item.foodItem.toString() === foodItemId
  )

  if (itemIndex === -1) {
    return next(new ErrorHandler("Item not in cart", 404))
  }

  cart.foodItems[itemIndex].quantity = quantity
  await cart.save()

  const updatedCart = await Cart.findById(cart._id).populate("foodItems.foodItem")

  res.status(200).json({
    status: "Success",
    data: updatedCart
  })
})

export const removeFromCart = catchAsyncErrors(async (req, res, next) => {
  const { foodItemId } = req.params
  const userId = req.user.id

  const foodItem = await FoodItem.findById(foodItemId)
  if (!foodItem) {
    return next(new ErrorHandler("Food item not found", 404))
  }

  const cart = await Cart.findOne({ user: userId, restaurant: foodItem.restaurant })
  if (!cart) {
    return next(new ErrorHandler("Cart not found", 404))
  }

  cart.foodItems = cart.foodItems.filter(
    item => item.foodItem.toString() !== foodItemId
  )
  await cart.save()

  if (cart.foodItems.length === 0) {
    await Cart.findByIdAndDelete(cart._id)
    return res.status(200).json({
      status: "Success",
      data: { user: userId, restaurant: foodItem.restaurant, foodItems: [] }
    })
  }

  const updatedCart = await Cart.findById(cart._id).populate("foodItems.foodItem")

  res.status(200).json({
    status: "Success",
    data: updatedCart
  })
})

export const clearCart = catchAsyncErrors(async (req, res, next) => {
  const { restaurantId } = req.params
  const userId = req.user.id

  await Cart.findOneAndDelete({ user: userId, restaurant: restaurantId })

  res.status(200).json({
    status: "Success",
    message: "Cart cleared"
  })
})