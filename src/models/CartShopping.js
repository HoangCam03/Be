const mongoose = require("mongoose");

const CartShoppingSchema = new mongoose.Schema(
  {
    CartShoppingItems: [
      {
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    shippingAddress: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: Number, required: true },
      email: { type: String, required: true }, 
    },
  
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: false },
    totalPrice: { type: Number, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const CartShopping = mongoose.model("CartShopping", CartShoppingSchema);
module.exports = CartShopping;