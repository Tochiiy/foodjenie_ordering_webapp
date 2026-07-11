import mongoose from "mongoose"

const couponSchema = new mongoose.Schema({
  couponName: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  subTitle: {
    type: String,
    required: true,
  },
  minAmount: {
    type: Number,
    required: true,
  },
  maxDiscount: {
    type: Number,
  },
  discount: {
    type: Number,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  expire: {
    type: Date,
    required: true,
  },
})

export default mongoose.model("coupon", couponSchema)
