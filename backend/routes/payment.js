import express from "express"
const router = express.Router()
import { processPayment, sendStripeApi } from "../controllers/paymentController.js"
import { isAuthenticatedUser } from "../middlewares/auth.js"

router.use(isAuthenticatedUser)

router.route("/process").post(processPayment)
router.route("/stripeapikey").get(sendStripeApi)

export default router