const Order = require("../models/OrderProduct");
const User = require("../models/UserModel");
const Product = require("../models/ProductModel");

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderItems,
      shippingAddress,
      itemsPrice,
      shippingPrice,
      paymentMethod,
      totalPrice,
      isPaid,
      user,
    } = newOrder;

    try {
      // Kiểm tra nếu đơn hàng rỗng
      if (!orderItems || orderItems.length === 0) {
        return resolve({
          status: "Error",
          message: "No order items",
        });
      }

      // Kiểm tra và cập nhật từng sản phẩm
      const promises = orderItems.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            countInStock: { $gte: order.amount }, // Đảm bảo sản phẩm còn đủ số lượng
          },
          {
            $inc: {
              countInStock: -order.amount, // Giảm số lượng tồn kho
              sold: order.amount, // Tăng số lượng đã bán
            },
          },
          { new: true }
        );

        if (!productData) {
          throw new Error(  
            `Product with ID ${order.product} is out of stock or insufficient quantity. Available: ${productData ? productData.countInStock : 0}, Required: ${order.amount}`
          );
        }

        // Log productData chỉ để kiểm tra
        console.log("Order was created:", productData);
      });

      // Chờ tất cả các Promise trong map hoàn thành
      await Promise.all(promises);

      // Tạo đơn hàng sau khi tất cả sản phẩm được cập nhật
      const createdOrder = await Order.create({
        orderItems,
        shippingAddress,
        itemsPrice,
        shippingPrice,
        totalPrice,
        paymentMethod,
        isPaid,
        user,
      });

      resolve({
        status: "OK",
        message: "Order created successfully",
        data: createdOrder,
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: error.message || "An error occurred while creating the order",
      });
    }
  });
  };


const getOrderOfUser = (userId) => {
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
      const userOrders = await Order.find({ user: userId });

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

const deleteOrder = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm và xóa đơn hàng
      const deletedOrder = await Order.findByIdAndDelete(orderId);

      if (!deletedOrder) {
        return resolve({
          status: "ERR",
          message: "Order not found",
        });
      }

      resolve({
        status: "OK",
        message: "Order deleted successfully",
        data: deletedOrder,
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: "An error occurred while deleting the order",
        error: error.message,
      });
    }
  });
};



const updatePaymentStatus = async (orderId, isPaid) => {
  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { isPaid },
    { new: true }
  );

  if (!updatedOrder) {
    throw new Error('Order not found');
  }

  return updatedOrder;
};



module.exports = {
  createOrder,
  getOrderOfUser,
  deleteOrder,
  updatePaymentStatus,
};