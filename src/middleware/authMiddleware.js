const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");

dotenv.config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.token; // Thay đổi ở đây
  if (!authHeader) {
    return res.status(401).json({ message: "Token is required", status: "Error" });
  }
  const token = authHeader.split(" ")[1]; // Bỏ chữ 'Bearer' và lấy token
  if (!token) {
    return res.status(401).json({ message: "Token is missing", status: "Error" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token", status: "Error" });
    }

    req.user = user;

    next(); // Tiếp tục xử lý nếu token hợp lệ
  });
};

const authUserMiddleware = (req, res, next) => {
  const userId = req.params.id; // Kiểm tra xem token có trong headers không

  console.log("check token::: ", req.headers.token);

  if (!req.headers.token) {
    // Trả về lỗi nếu không có token

    return res.status(401).json({
      message: "Token is required",

      status: "Error",
    });
  } // Lấy token từ header (bỏ qua từ khóa "Bearer" ở đầu)

  const token = req.headers.token.split(" ")[1]; // Kiểm tra token có tồn tại không

  if (!token) {
    return res.status(401).json({
      message: "Token is missing",

      status: "Error",
    });
  } // Xác thực token

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decodedToken) {
    if (err) {
      return res.status(403).json({
        message: "Invalid token",

        status: "Error",
      });
    }

    console.log("Decoded user payload::::", decodedToken);

    console.log("Check isAdmin:::: ", decodedToken.isAdmin); // Truy cập trực tiếp vào isAdmin // So sánh ID của user từ token và ID trong request params
    const isAdmin = decodedToken.isAdmin;

    const isSameUser = decodedToken.id === String(userId); // So sánh cả hai là chuỗi // Kiểm tra quyền admin hoặc chính user
    if (isAdmin || isSameUser) {
      next();
    } else {
      return res.status(403).json({
        message: "You do not have permission",

        status: "Error",
      });
    }
  });
};

module.exports = {
  authMiddleware,
  authUserMiddleware,
};
