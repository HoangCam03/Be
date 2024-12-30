const ProductService = require("../services/ProductService");

const createProduct = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Kiểm tra dữ liệu từ request

    const { name, image, type, price, discount, countInStock, rating, sold, description } = req.body;
    console.log("Request body image:", image); // kiểm tra giá trị image

    // Kiểm tra các trường bắt buộc
    if (!name || !image || !type || !price || !countInStock || !rating || !sold) {
      return res.status(400).json({
        status: "Error",
        message: "The Input is required",
      });
    }

    console.log("Request body--------->>>>>:", req.body);

    // Gọi hàm createProduct từ ProductService
    const result = await ProductService.createProduct(req.body);

    return res.status(200).json({
      status: "OK",
      message: "Product created successfully",
      product: result,
    });
  } catch (error) {
    console.error(error); // Log lỗi để debug
    return res.status(400).json({ message: error.message }); // Trả về lỗi
  }
};
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;

    // Log thông tin token và người dùng
    console.log("Token info:", req.user);

    if (!productId) {
      return res.status(400).json({
        status: "Error",
        message: "The productId is required",
      });
    }

    console.log("productId:", productId);

    const response = await ProductService.updateProduct(productId, data);
    if (response.status === "ERR") {
      return res.status(404).json({
        status: "Error",
        message: "Product not found",
      });
    }

    return res.status(200).json({
      status: "OK",
      message: "Product updated successfully",
      product: response.product,
    });
  } catch (error) {
    console.error("Error during update:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getDetailProduct = async (req, res) => {
  try {
    const productId = req.params.id;


    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "The ProductId is require",
      });
    }

    const response = await ProductService.getDetailProduct(productId);
    console.log("response----->", response);

    return res.status(200).json(response); // Trả về kết quả khi thành công
  } catch (error) {
    console.error(error); // Log lỗi để debug
    return res.status(400).json({ message: error.message }); // Trả về lỗi
  }
};

const deleteProduct = async (req, res) => {
  try {
    const ProductId = req.params.id;
    const token = req.headers;

    if (!ProductId) {
      return res.status(200).json({
        status: "ERR",
        message: "The ProductId is require",
      });
    }

    const response = await ProductService.deleteProduct(ProductId);
    return res.status(200).json(response); // Trả về kết quả khi thành công
  } catch (error) {
    console.error(error); // Log lỗi để debug
    return res.status(400).json({ message: error.message }); // Trả về lỗi
  }
};

// Controller
const getAllProduct = async (req, res) => {
  try {
    const { limit = 2, page = 0, sort, filter } = req.query;
    const response = await ProductService.getAllProduct(
      Number(limit),
      Number(page),
      sort,
      filter
    );
    return res.status(200).json(response); // Trả về kết quả khi thành công
  } catch (error) {
    console.error(error); // Log lỗi để debug
    return res.status(400).json({ message: error.message });
  }
};
const getProductsByType = async (req, res) => {
  try {
    const { type, limit = 10, page = 0 } = req.query;
    if (!type) {
      return res.status(400).json({ message: "Type is required" });
    }
    const response = await ProductService.getProductsByType(type, Number(limit), Number(page));
    return res.status(200).json(response); // Trả về kết quả khi thành công
  } catch (error) {
    console.error(error); // Log lỗi để debug
    return res.status(400).json({ message: error.message });
  }
};


const deleteManyProduct = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids) {
      return res.status(200).json({
        status: "ERR",
        message: "The Ids is require",
      });
    }

    const response = await ProductService.deleteManyProduct(ids);
    return res.status(200).json(response); // Trả về kết quả khi thành công
  } catch (error) {
    console.error(error); // Log lỗi để debug
    return res.status(400).json({ message: error.message }); // Trả về lỗi
  }
};

const getAllType = async (req, res) => {
  try {
    
    const response = await ProductService.getAllType();
    return res.status(200).json(response); // Trả về kết quả khi thành công
  } catch (error) {
    console.error(error); // Log lỗi để debug
    return res.status(400).json({ message: error.message });
  }
};




module.exports = {
  createProduct,
  updateProduct,
  getDetailProduct,
  deleteProduct,
  getAllProduct,
  getAllType,
  getProductsByType,
  deleteManyProduct,
};
