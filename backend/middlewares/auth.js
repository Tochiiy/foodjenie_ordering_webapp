import ErrorHandler from "../utils/errorHandler.js"
import catchAsyncErrors from "./catchAsyncErrors.js"
import User from "../models/user.js"
import jwt from "jsonwebtoken"

export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { jwt: token } = req.cookies

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401))
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET)

  req.user = await User.findById(decodedData.id)

  if (!req.user) {
    return next(new ErrorHandler("User not found", 404))
  }

  next()
})

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler("Not authenticated", 401))
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource`,
          403
        )
      )
    }

    next()
  }
}