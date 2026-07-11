import Order from "../models/order.js"
import ErrorHandler from "../utils/errorHandler.js"
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js"

export const createOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    restaurant,
    paymentInfo,
    itemsPrice,
    deliveryPrice,
    totalPrice,
  } = req.body

  const order = await Order.create({
    shippingInfo,
    orderItems,
    restaurant,
    paymentInfo,
    itemsPrice,
    deliveryPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user.id,
  })

  res.status(201).json({
    status: "Success",
    data: order,
  })
})

export const getMyOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id }).populate(
    "orderItems.foodItem restaurant"
  )

  res.status(200).json({
    status: "Success",
    data: orders,
  })
})

export const getOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "orderItems.foodItem restaurant user"
  )

  if (!order) {
    return next(new ErrorHandler("Order not found", 404))
  }

  res.status(200).json({
    status: "Success",
    data: order,
  })
})

export const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find().populate("user", "name email")

  res.status(200).json({
    status: "Success",
    count: orders.length,
    data: orders,
  })
})

export const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    return next(new ErrorHandler("Order not found", 404))
  }

  if (order.orderStatus === "delivered") {
    return next(new ErrorHandler("Order already delivered", 400))
  }

  order.orderStatus = req.body.status

  if (req.body.status === "delivered") {
    order.deliveredAt = Date.now()
  }

  await order.save()

  res.status(200).json({
    status: "Success",
    data: order,
  })
})
