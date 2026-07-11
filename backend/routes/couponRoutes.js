import express from "express"
const router = express.Router()
import { createCoupon, getCoupon, updateCoupon, deleteCoupon, couponValidate } from "../controllers/couponController.js"

router.route("/").post(createCoupon).get(getCoupon)
router.route("/:couponId").patch(updateCoupon).delete(deleteCoupon)
router.route("/validate").post(couponValidate)

export default router
