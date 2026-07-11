import express from "express"
const router = express.Router()
import { signup, login, logout, getMe, updateProfile } from "../controllers/authController.js"
import { isAuthenticatedUser } from "../middlewares/auth.js"

router.post("/signup", signup)
router.post("/login", login)
router.get("/me", isAuthenticatedUser, getMe)
router.put("/me", isAuthenticatedUser, updateProfile)
router.post("/logout", logout)

export default router