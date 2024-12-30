const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
var multer = require("multer");
const axios = require("axios").default; // npm install axios
const CryptoJS = require("crypto-js"); // npm install crypto-js
const moment = require("moment"); // npm install moment
const qs = require('qs')
var forms = multer();
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(forms.array());
app.use(express.json()); // Thay vì dùng bodyParser.json()
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // Thay vì dùng bodyParser.urlencoded()

// Middleware để xử lý tải lên file (nếu có)
app.use(forms.array());  // Nếu bạn muốn xử lý nhiều tệp tải lên

// Cấu hình giới hạn kích thước payload cho JSON và URL-encoded
app.use(express.json({ limit: "50mb" })); // Giới hạn payload JSON tối đa là 50MB
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Giới hạn URL-encoded tối đa là 50MB

app.use(
  cors({
    origin: "http://localhost:8888", // Địa chỉ frontend của bạn
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const routes = require("./routes/api");
// Giả sử bạn có một file routes.js để định nghĩa các route

const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

app.post("/api/payment", async (req, res) => {
  const { name, description, user, provisionalPrice, image } = req.body;
  console.log('Received payment request:', req.body); // Log chi tiết request nhận được

  const embed_data = {
    redirecturl: "http://localhost:8888",
  };

  const items = [
    {
        product_id: "6738499565af245ff1d84b9c",
        product_name: name,
        // product_image: image, // Ví dụ: https://example.com/product-image.jpg
        product_description: description,
    },
];
 // Thêm thông tin hình ảnh vào items
  const transID = Math.floor(Math.random() * 1000000);
  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
    app_user: user,
    app_time: Date.now(),
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    name:name,
    description: description,
    amount: provisionalPrice,
    bank_code: "",
    callback_url: "https://8e3e-58-187-92-200.ngrok-free.app/callback"
  };

  const data =
    config.app_id +
    "|" +
    order.app_trans_id +
    "|" +
    order.app_user +
    "|" +
    order.amount +
    "|" +
    order.app_time +
    "|" +
    order.embed_data +
    "|" +
    order.item;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  console.log('Order data:', order); // Log chi tiết order data

  try {
    const result = await axios.post(config.endpoint, null, { params: order });
    console.log('Payment response:', result.data); // Log chi tiết response từ payment endpoint
    res.json({ payment_url: result.data.order_url });
  } catch (error) {
    console.error('Error initiating payment:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post("/callback", (req, res) => {
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, config.key2);
      console.log(
        "update order's status = success where app_trans_id =",
        dataJson["app_trans_id"]
      );

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
});

app.post("/order-status/:app_trans_id", async (req, res) => {
  const app_trans_id = req.params.app_trans_id
  let postData = {
    app_id: config.app_id,
    app_trans_id: app_trans_id, // Input your app_trans_id
}

let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();


let postConfig = {
    method: 'post',
    url: "https://sb-openapi.zalopay.vn/v2/query",
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(postData)
};


try {
    
  const result = await axios(postConfig)
  res.status(200).json(result.data)

} catch (error) {
  console.log(error.message);
  
}
});



routes(app);
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("Connect DB success!");
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});