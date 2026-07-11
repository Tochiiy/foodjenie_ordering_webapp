import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  foodItems: [
    {
      foodItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodItem",
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("Cart", cartSchema);
