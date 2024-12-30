const User = require("../models/UserModel");
const Product = require("../models/ProductModel");
const CartShopping = require("../models/CartShopping");

const AddCartShopping = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      CartShoppingItems,
      shippingAddress,
      itemsPrice,
      shippingPrice,
      totalPrice,
      user,
    } = newOrder;

    try {
      // Kiểm tra nếu đơn hàng rỗng
      if (!CartShoppingItems || CartShoppingItems.length === 0) {
        return resolve({
          status: "Error",
          message: "No order items",
        });
      }
      // Tạo đơn hàng sau khi tất cả sản phẩm được cập nhật
      const addCartShopping = await CartShopping.create({
        CartShoppingItems,
        shippingAddress,
        itemsPrice,
        shippingPrice,
        totalPrice,
        user,
      });

      resolve({
        status: "OK",
        message: "Order added successfully",
        data: addCartShopping,
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: error.message || "An error occurred while creating the order",
      });
    }
  });
  };


  const getCartShopping = (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Kiểm tra người dùng có tồn tại
        const user = await User.findById(userId);
  
        if (!user) {
          return resolve({
            status: "ERR",
            message: "User not found",
          });
        }
  
        // Tìm tất cả đơn hàng liên quan đến người dùng
        const userOrders = await CartShopping.find({ user: userId });
  
        if (userOrders.length === 0) {
          return resolve({
            status: "ERR",
            message: "No orders found for this user",
          });
        }
  
        resolve({
          status: "OK",
          message: "Orders retrieved successfully",
          data: userOrders,
        });
  
      } catch (error) {
        reject({
          status: "ERR",
          message: "An error occurred while fetching orders",
          error: error.message,
        });
      }
    });
  };

module.exports = {
  AddCartShopping,
  getCartShopping,
};