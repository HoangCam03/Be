const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        image: { type: mongoose.Schema.Types.Mixed, required: true }, // Hỗ trợ cả string và array
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
      email: { type: String, required: true }, // Loại bỏ `unique: true`
    },
    paymentMethod: { type: String, default: false },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: false },
    totalPrice: { type: Number, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;