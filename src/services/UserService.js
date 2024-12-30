const User = require("../models/UserModel");
const bcrypt = require("bcrypt"); ///????
const { genneralAccessToken, genneralRefreshToken } = require("./jstService");
const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password,confirmPassword, phone } = newUser;

    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser !== null) {
        resolve({
          status: "ok",
          message: " The email is already",
        });
      }
      const hash = bcrypt.hashSync(password, 10);
      console.log("hash", hash);
      const createUser = await User.create({
        name,
        email,
        password: hash, ///cho hash vao passw
        confirmPassword,
        phone,
      });
      if (createUser) {
        resolve({
          status: "Ok",
          message: " Success",
          data: createUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;

    try {
      // Tìm người dùng theo email
      const checkUser = await User.findOne({ email: email });
      if (!checkUser) {
        resolve({
          status: "Error",
          message: "The user is not defined",
        });
        return; // Thoát khỏi hàm sau khi trả về kết quả
      }

      console.log("id from DB:", checkUser.id);
      console.log("Hashed password from DB:", checkUser.password);

      // So sánh mật khẩu đã nhập với mật khẩu trong cơ sở dữ liệu
      const comparePassword = bcrypt.compareSync(password, checkUser.password);
      console.log("comparePassword", comparePassword);

      // Nếu mật khẩu không đúng, trả về thông báo lỗi
      if (!comparePassword) {
        resolve({
          status: "Error",
          message: "Password or user is not correct",
        });
        return; // Thoát khỏi hàm sau khi trả về kết quả
      }

      // Nếu mật khẩu đúng, tạo refresh_token và access_token
      const refresh_token = await genneralRefreshToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });

      const access_token = await genneralAccessToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });

      console.log("access_token:", access_token);

      // Trả về kết quả thành công
      resolve({
        status: "OK",
        message: "SUCCESS",
        access_token,
        refresh_token,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateUser = async (userId, data) => {
  try {
    if (!userId) {
      return {
        status: 'ERR',
        message: 'The userId is required',
      };
    }

    // Nếu có trường password, mã hóa mật khẩu trước khi cập nhật
    if (data.password) {
      const saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(data.password, saltRounds);
      data.password = hashedPassword; // Ghi đè lại mật khẩu bằng phiên bản đã mã hóa
    }

    // Cập nhật thông tin người dùng
    const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true });

    if (!updatedUser) {
      return {
        status: 'ERR',
        message: 'User not found',
      };
    }

    return {
      status: 'OK',
      message: 'User updated successfully',
      user: updatedUser,
    };
  } catch (error) {
    return {
      status: 'ERR',
      message: error.message,
    };
  }
};

const deleteUser = (Id) => {

  return new Promise(async (resolve, reject) => {

    try {
      const checkUser = await User.findOne({
        _id: Id
      })

      console.log('checkUser: ', checkUser );


      if (checkUser === null) {
        resolve({
          status: "ok",
          message: " The user is not defined",
        });
      }
      
      await User.findByIdAndDelete(Id);

      resolve({
        status: "OK",
        message: "Delete SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });

};

const getAllUser = () => {

  return new Promise(async (resolve, reject) => {

    try {
      const allUser =await User.find();
      resolve({
        status: "OK",
        message: "GET ALL USER SUCCESS",
        data: allUser
      });
    } catch (e) {
      reject(e);
    }
  });

};
const getDetailUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });

      console.log('checkUser: ', checkUser);

      if (!checkUser) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "GET USER SUCCESS",
        data: checkUser
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyUser = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.deleteMany({_id: ids})
      resolve({
        status: "OK",
        message: "Delete SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};




module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailUser,
  deleteManyUser,
};
