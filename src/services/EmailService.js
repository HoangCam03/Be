const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465
  auth: {
    user: process.env.MAIL_ACCOUNT,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendEmailCreateOrder = async (toEmail, subject, htmlContent) => {
  try {
    const info = await transporter.sendMail({
      from: `"Cmai Shop" <${process.env.MAIL_ACCOUNT}>`, // Người gửi
      to: toEmail, // Người nhận
      subject, // Chủ đề email
      html: htmlContent, // Nội dung HTML
    });

    console.log("Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = { sendEmailCreateOrder };