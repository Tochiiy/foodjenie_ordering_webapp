import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    phone: { type: String, required: true },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      foodItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodItem",
        required: true,
      },
    },
  ],
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  paymentInfo: {
    sessionId: { type: String, required: true },
    status: { type: String, default: "paid" },
  },
  paidAt: { type: Date },
  itemsPrice: { type: Number, required: true, default: 0 },
  deliveryPrice: { type: Number, required: true, default: 0 },
  totalPrice: { type: Number, required: true, default: 0 },
  orderStatus: {
    type: String,
    required: true,
    default: "processing",
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Order", orderSchema)
