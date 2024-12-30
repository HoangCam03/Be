const Product = require("../models/ProductModel");
const { filterProducts } = require("./filterService");
const { sortProduct } = require("./sortService");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const { name, image, type, price, discount, countInStock, sold, rating, description } = newProduct;

    try {
      const checkProduct = await Product.findOne({ name: name });
      if (checkProduct !== null) {
        resolve({
          status: "Error",
          message: "The Product already exists",
        });
        return;
      }

      const createdProduct = await Product.create({
        name,
        image: image || "", // Sử dụng image base64 hoặc chuỗi rỗng
        type,
        price,
        discount,
        countInStock,
        rating,
        sold,
        description,
      });

      if (createdProduct) {
        resolve({
          status: "OK",
          message: "Product created successfully",
          data: createdProduct,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};



const updateProduct = async (productId, data) => {
  try {
    if (!productId) {
      return {
        status: "ERR",
        message: "The productId is required",
      };
    }
    // Cập nhật thông tin người dùng
    const updateProduct = await Product.findByIdAndUpdate(productId, data, {
      new: true,
    });

    if (!updateProduct) {
      return {
        status: "ERR",
        message: "product not found",
      };
    }

    return {
      status: "OK",
      message: "product updated successfully",
      product: updateProduct,
    };
  } catch (error) {
    return {
      status: "ERR",
      message: error.message,
    };
  }
};

const getDetailProduct = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: productId,
      });

      console.log("checkProduct: ", checkProduct);

      if (checkProduct === null) {
        resolve({
          status: "ok",
          message: " The product is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "GET Product SUCCESS",
        data: checkProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProduct = (Id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: Id,
      });

      console.log("checkProduct: ", checkProduct);

      if (checkProduct === null) {
        resolve({
          status: "ok",
          message: " The Product is not defined",
        });
      }

      await Product.findByIdAndDelete(Id);

      resolve({
        status: "OK",
        message: "Delete SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};


// Service: getAllProduct
// ProductService
const getAllProduct = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Xác định điều kiện lọc sản phẩm
      const filterQuery = Array.isArray(filter) && filter.length > 0 ? filterProducts(filter) : {};
      
      // Đếm tổng số sản phẩm thỏa mãn điều kiện lọc
      const totalProduct = await Product.countDocuments(filterQuery);

      // Xác định điều kiện sắp xếp sản phẩm
      const sortObject = await sortProduct(sort);

      // Lấy sản phẩm theo trang hiện tại và giới hạn số lượng
      const allProduct = await Product.find(filterQuery)
        .limit(limit)
        .skip(limit * page)
        .sort(sortObject);

      // Tính tổng số trang dựa trên tổng số sản phẩm và giới hạn mỗi trang
      const totalPage = Math.ceil(totalProduct / limit);

      resolve({
        status: "OK",
        message: "GET AllProduct SUCCESS",
        data: allProduct,
        totalProduct: totalProduct,
        pageCurrent: page + 1,
        totalPage: totalPage,
      });
    } catch (e) {
      reject({
        status: "ERROR",
        message: e.message,
      });
    }
  });
};

const getProductsByType = (type, limit, page) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tạo điều kiện lọc theo type
      const filterQuery = { type: type };

      // Đếm tổng số sản phẩm thỏa mãn điều kiện lọc
      const totalProduct = await Product.countDocuments(filterQuery);

      // Lấy sản phẩm theo trang hiện tại và giới hạn số lượng
      const products = await Product.find(filterQuery)
        .limit(limit)
        .skip(limit * page);

      // Tính tổng số trang dựa trên tổng số sản phẩm và giới hạn mỗi trang
      const totalPage = Math.ceil(totalProduct / limit);

      resolve({
        status: "OK",
        message: "GET Products By Type SUCCESS",
        data: products,
        totalProduct: totalProduct,
        pageCurrent: page + 1,
        totalPage: totalPage,
      });
    } catch (e) {
      reject({
        status: "ERROR",
        message: e.message,
      });
    }
  });
};

const deleteManyProduct = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Product.deleteMany({_id: ids})
      resolve({
        status: "OK",
        message: "Delete SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};


const getAllType = () => {
  return new Promise(async (resolve, reject) => {
    try {    
      const allType = await Product.distinct("type");
      resolve({
        status: "OK",
        message: "GET AllProduct SUCCESS",
        data: allType,
      });
    } catch (e) {
      reject({
        status: "ERROR",
        message: e.message,
      });
    }
  });
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
