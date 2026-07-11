import User from "../models/user.js"
import ErrorHandler from "../utils/errorHandler.js"
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js"
import sendToken from "../utils/sendToken.js"
import cloudinary from "../config/cloudinary.js"

export const signup = catchAsyncErrors(async (req, res, next) => {
  console.log('Signup request received:', req.body)
  const { name, email, password, passwordConfirm, phoneNumber } = req.body

  let avatar
  if (!req.body.avatar || req.body.avatar === "/images/images.png") {
    avatar = {
      public_id: "default",
      url: "/images/images.png"
    }
  } else {
    const result = await cloudinary.uploader.upload(req.body.avatar, {
      folder: "avatar",
      width: 150,
      crop: "scale",
    })
    avatar = {
      public_id: result.public_id,
      url: result.url
    }
  }

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    phoneNumber,
    avatar
  })

  sendToken(user, 200, res)
})

export const login = catchAsyncErrors(async (req, res, next) => {
  console.log('Login request received:', req.body)

  const { email, password } = req.body

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400))
  }

  const user = await User.findOne({ email }).select("+password")

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401))
  }

  const isPasswordMatched = await user.correctPassword(password, user.password)

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401))
  }

  sendToken(user, 200, res)

})

export const getMe = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: { user: req.user },
  })
})

export const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("jwt", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    message: "Logged out",
  })
})

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phoneNumber } = req.body

  let avatar
  if (req.body.avatar && req.body.avatar !== "/images/images.png") {
    const result = await cloudinary.uploader.upload(req.body.avatar, {
      folder: "avatar",
      width: 150,
      crop: "scale",
    })
    avatar = {
      public_id: result.public_id,
      url: result.url,
    }
  }

  const updateData = { name, email, phoneNumber }
  if (avatar) updateData.avatar = avatar

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updateData,
    { new: true, runValidators: true }
  )

  res.status(200).json({
    success: true,
    data: { user },
  })
})