const UserService = require("../services/UserService");
const JwtService = require("../services/jstService");

const multer = require('multer');

const createUser = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Kiểm tra dữ liệu từ request
    const { name, email, password, confirmPassword, phone } = req.body;

    console.log("Extracted email:", email); // Kiểm tra giá trị email

    const reg = /^[\w+\-._]+@[a-zA-Z\d\-]+\.[a-zA-Z]+$/; // Biểu thức chính quy đơn giản hơn
    const isCheckEmail = reg.test(email);

    console.log("IsCheckEmail:", isCheckEmail); // Đảm bảo log đúng giá trị isCheckEmail

    if (!name || !email || !password || !confirmPassword) {
      return res.status(200).json({
        status: "Error",
        message: "The Input is required",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "Error",
        message: "The Email is required",
      });
    } else if (password !== confirmPassword) {
      return res.status(200).json({
        status: "Error",
        message: "The password must equal",
      });
    }

    const result = await UserService.createUser(req.body);
    return res.status(200).json(result); // Trả về kết quả khi thành công
  } catch (error) {
    console.error(error); // Log lỗi để debug
    return res.status(400).json({ message: error.message }); // Trả về lỗi
  }
};
const loginUser = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Kiểm tra dữ liệu từ request
    const { email, password } = req.body;

    console.log("Extracted email:", email); // Kiểm tra giá trị email

    const reg = /^[\w+\-._]+@[a-zA-Z\d\-]+\.[a-zA-Z]+$/; // Biểu thức chính quy đơn giản hơn
    const isCheckEmail = reg.test(email);

    console.log("IsCheckEmail:", isCheckEmail); // Đảm bảo log đúng giá trị isCheckEmail

    // Kiểm tra xem email và password có được gửi lên không
    if (!email || !password) {
      return res.status(400).json({
        status: "Error",
        message: "The Input is required",
      });
    }

    // Kiểm tra định dạng email
    if (!isCheckEmail) {
      return res.status(400).json({
        status: "Error",
        message: "The Email is required",
      });
    }

    // Gọi service để xử lý đăng nhập
    const result = await UserService.loginUser(req.body);
    console.log("Login result:", result); // Kiểm tra giá trị result

    // Nếu kết quả trả về có lỗi, trả về kết quả lỗi
    if (result.status === "Error") {
      return res.status(400).json({
        status: result.status,
        message: result.message,
      });
    }

    // Nếu đăng nhập thành công, lấy refresh_token và access_token từ kết quả
    const { refresh_token, access_token } = result;
    console.log("Refresh Token:==============================>", refresh_token);

    // Đặt refresh_token trong cookie và không trả về trong response
    res.cookie('refresh_token', refresh_token, {
      HttpOnly: true,
    });

    // Trả về kết quả thành công
    return res.status(200).json({
      status: "OK",
      message: "SUCCESS",
      access_token,
    });
  } catch (error) {
    console.error(error); // Log lỗi để debug
    return res.status(500).json({ message: error.message }); // Trả về lỗi
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    console.log(data);
    if(!userId){
      return res.status(200).json({
        status :'ERR',
        message:'The userId is require'
      })
    }
    
    const dataUpdate = {
      name : data.name,
      phone: data.phone,
      address: data.address,
      isAdmin: req.body.isAdmin === 'true',// Chuyển 'true' thành boolean true

    }
    const response = await UserService.updateUser(userId, dataUpdate);
    console.log('response', response, dataUpdate);
    return res.status(200).json(response); // Trả về kết quả khi thành công
  } catch (error) {
    console.error(error); // Log lỗi để debug
    return res.status(400).json({ message: error.message }); // Trả về lỗi
  }
};


const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const token = req.headers 

    if(!userId){
      return res.status(200).json({
        status :'ERR',
        message:'The userId is require'
      })
    }

    const response = await UserService.deleteUser(userId);
    return res.status(200).json(response); // Trả về kết quả khi thành công
  } catch (error) {
    console.error(error); // Log lỗi để debug
    return res.status(400).json({ message: error.message }); // Trả về lỗi
  }
};

const getAllUser = async (req, res) => {
  try {
    const response = await UserService.getAllUser();
    return res.status(200).json(response); // Trả về kết quả khi thành công
  } catch (error) {
    console.error(error); // Log lỗi để debug
    return res.status(400).json({ message: error.message }); // Trả về lỗi
  }
};


const getDetailUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        status: 'ERR',
        message: 'The userId is required'
      });
    }

    const response = await UserService.getDetailUser(userId);
    return res.status(200).json(response); // Trả về kết quả khi thành công
  } catch (error) {
    console.error(error); // Log lỗi để debug
    return res.status(400).json({ message: error.message }); // Trả về lỗi
  }
};


const refreshToken = async (req, res) => {
  try {
    console.log('Request cookies:', req.cookies); // Hiển thị cookies để kiểm tra token nhận được

    // Lấy token từ header hoặc từ cookies nếu có
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.refresh_token;

    // Kiểm tra xem token có tồn tại không
    if (!token) {
      return res.status(400).json({
        status: 'Error',
        message: 'The token is invalid or not provided',
      });
    }

    // Gọi dịch vụ để làm mới token với token hiện tại
    const response = await JwtService.refreshTokenJwtService(token);

    // Trả về kết quả khi thành công, bao gồm token mới
    return res.status(200).json({
      status: 'OK',
      message: 'Token refreshed successfully',
      ...response,
    });
  } catch (error) {
    console.error('Error refreshing token:', error); // Log lỗi để debug
    return res.status(500).json({ 
      status: 'Error', 
      message: 'An error occurred while refreshing the token',
    });
  }
};

const deleteManyUser = async (req, res) => {
  try {
    const ids = req.body.ids;
    console.log('id===>', ids);
    if (!ids) {
      return res.status(200).json({
        status: "ERR",
        message: "The Ids is require",
      });
    }

    const response = await UserService.deleteManyUser(ids);
    return res.status(200).json(response); // Trả về kết quả khi thành công
  } catch (error) {
    console.error(error); // Log lỗi để debug
    return res.status(400).json({ message: error.message }); // Trả về lỗi
  }
};

module.exports = {
  createUser,loginUser, updateUser, deleteUser, getAllUser,getDetailUser, refreshToken, deleteManyUser,
};
