const CartShoppingService = require("../services/CartShoppingService");

const AddCartShopping = async (req, res) => {
  try {
    const {
      CartShoppingItems,
      shippingAddress,
      itemsPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    // Kiểm tra các trường bắt buộc
    if (
      !CartShoppingItems ||
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
    console.log('User check:' , user)

    // Gọi service để tạo đơn hàng
    const result = await CartShoppingService.AddCartShopping({
      CartShoppingItems,
      shippingAddress,
      itemsPrice,
      shippingPrice,
      totalPrice,
      user,
    });
    console.log("result-add cartshopping", result);
    return res.status(200).json({
      status: "OK",
      message: "Order added successfully",
      order: result,
    });
  } catch (error) {
    console.error("Error add order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getCartShopping = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await CartShoppingService.getCartShopping(userId);
    return res.status(200).json(response); // Trả về kết quả khi thành công
  } catch (error) {
    console.error(error); // Log lỗi để debug
    return res.status(400).json({ message: error.message }); // Trả về lỗi
  }
};

module.exports = {
  AddCartShopping,
  getCartShopping,
};
