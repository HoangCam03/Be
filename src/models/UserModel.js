const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    confirmPassword: { type: String, require: true },
    isAdmin: { type: Boolean, default: false, require: true },
    phone: { type: Number, require: true },
    address: { type: String },
    avatar: { type: String },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
