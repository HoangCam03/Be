const OrderService = require("../services/OrderService");
const { sendEmailCreateOrder } = require("../services/EmailService");

const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      itemsPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    // Kiểm tra các trường bắt buộc
    if (
      !orderItems ||
      !shippingAddress ||
      itemsPrice === undefined ||
      shippingPrice === undefined ||
      totalPrice === undefined
    ) {
      return res.status(400).json({
        status: "Error",
        message: "Missing required fields",
      });
    }

    // Lấy user từ token (nếu cần)
    const user = req.user.id;

    // Gọi service để tạo đơn hàng
    const result = await OrderService.createOrder({
      orderItems,
      shippingAddress,
      itemsPrice,
      shippingPrice,
      totalPrice,
      user,
    });
     // Kiểm tra và log thông tin người dùng
     let userEmail = req.user ? req.user.email : null; // Lấy email của người dùng từ token nếu có
     if (!userEmail && shippingAddress && shippingAddress.email) {
       userEmail = shippingAddress.email; // Lấy email từ địa chỉ giao hàng nếu không có trong token
     }
     console.log('userEmail:', userEmail); // Log email người dùng để kiểm tra
 
     if (!userEmail) {
       console.error("User email is missing");
       return res.status(400).json({
         status: "Error",
         message: "User email is missing",
       });
     }

    // Tạo danh sách sản phẩm với hình ảnh

    const listItems = orderItems
      .map(
        (order) => `
        <div style="margin-bottom: 10px;">
          <p>Sản phẩm: <b>${order.name}</b></p>
          <p>Số lượng: <b>${order.amount}</b></p>
        </div>
      ` 
    )
      .join("");
      const subject = "Xác nhận đơn hàng của bạn!";
    const htmlContent = `
      <h1>Cảm ơn bạn đã đặt hàng!</h1>
      <p>Tổng giá trị đơn hàng: <b>${totalPrice} VND</b></p>
      <h2>Chi tiết đơn hàng:</h2>
      ${listItems}
      <p>Chúc bạn một ngày vui vẻ!</p>
    `;
 
     await sendEmailCreateOrder(userEmail, subject, htmlContent);
 
     console.log("Order created and email sent");
 
     return res.status(200).json({
       status: "OK",
       message: "Order created successfully and email sent!",
       order: result,
     });
   } catch (error) {
     console.error("Error creating order:", error);
     return res.status(500).json({ message: "Internal server error" });
   }
 };

const getOrderOfUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await OrderService.getOrderOfUser(userId);
    return res.status(200).json(response); // Trả về kết quả khi thành công
  } catch (error) {
    console.error(error); // Log lỗi để debug
    return res.status(400).json({ message: error.message }); // Trả về lỗi
  }
};

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(400).json({
        status: "ERR",
        message: "The orderId is required",
      });
    }
    const response = await OrderService.deleteOrder(orderId);
    return res.status(200).json(response); // Trả về kết quả khi thành công
  } catch (error) {
    console.error(error); // Log lỗi để debug
    return res.status(400).json({ message: error.message }); // Trả về lỗi
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        status: "ERR",
        message: "The orderId and status are required",
      });
    }
    
    const isPaid = status === "COMPLETED";

    const updatedOrder = await OrderService.updatePaymentStatus(
      orderId,
      isPaid
    );
    console.log("updateOrder: ", updatedOrder)
    

    if (isPaid && updatedOrder.shippingAddress && updatedOrder.shippingAddress.email) {
      const userEmail = updatedOrder.shippingAddress.email;
      console.log('userEmail:', userEmail);

      // Gửi email thông báo thanh toán thành công
      const subject = "Xác nhận thanh toán đơn hàng của bạn!";
      const htmlContent = `
        <h1>Thanh toán thành công!</h1>
        <p>Đơn hàng của bạn đã được thanh toán thành công.</p>
        <p>Mã đơn hàng: <b>${updatedOrder._id}</b></p>
        <p>Tên sản phẩm: <b>${updatedOrder.orderItems[0].name}</b></p>
        <p>Tên sản phẩm: <b>${updatedOrder.orderItems[0].amount}</b></p>


        <p>Tổng giá trị đơn hàng: <b>${updatedOrder.totalPrice} VND</b></p>
        <p>Chúc bạn một ngày vui vẻ!</p>
      `;
      console.log('name', updatedOrder.orderItems.name)
      try {
        await sendEmailCreateOrder(userEmail, subject, htmlContent);
        console.log("Payment confirmation email sent");
      } catch (emailError) {
        console.error("Error sending email:", emailError.message);
        return res.status(500).json({ message: "Failed to send confirmation email" });
      }
    } else {
      console.warn("Payer email address is missing or payment is not completed");
    }



  return res.status(200).json({
    status: "OK",
    message: "Payment status updated successfully",
    data: updatedOrder,
  });
} catch (error) {
  console.error("Error in updatePaymentStatus:", error.message);
  return res.status(500).json({ message: "Internal server error" });
}
};


module.exports = {
  createOrder,
  getOrderOfUser,
  deleteOrder,
  updatePaymentStatus,
};
