const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
const axios = require("axios");

const Account = require("../models/account");
const Customer = require("../models/customer");
const Staff = require("../models/staff");
const AppError = require("../util/error");
dotenv.config();

sgMail.setApiKey(process.env.SG_API_KEY);
const transporter = nodemailer.createTransport({
  host: process.env.HOST_EMAIL,
  port: process.env.PORT_EMAIL,
  auth: {
    user: process.env.USERNAME_EMAIL,
    pass: process.env.PASSWORD_EMAIL
  }
})

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const account = await Account.findOne({ username });
    if (!account) {
      const error = new Error("Tên đăng nhập không tồn tại");
      error.statusCode = 401;
      return next(error);
    }

    const isValidPassword = bcryptjs.compareSync(password, account.password);
    if (!isValidPassword) {
      const error = new Error("Mật khẩu không đúng");
      error.statusCode = 401;
      return next(error);
    }

    const customer = await Customer.findOne({ account: account._id })
      .populate("account")
      .populate("cart.productId")
      .populate("orders")
      .populate('wishlist')
      .populate("promotions");

    const token = jwt.sign(
      {
        username: account.username,
        customerId: customer._id.toString(),
      },
      "secret",
      { expiresIn: "24h" }
    );

    res
      .status(200)
      .json({ token, customerId: customer._id.toString(), user: customer, message: "Đăng nhập thành công" });
  } catch (err) {
    const error = new Error("Có lỗi xảy ra, vui lòng thử lại sau");
    error.statusCode = 500;
    next(error);
  }
};

exports.loginWithSocialMediaAccount = async (req, res, next) => {
  const { name, email } = req.body;

  try {
    let customer = await Customer.findOne({ email: email })
      .populate("account")
      .populate("cart.productId")
      .populate("orders")
      .populate('wishlist')
      .populate("promotions");
    if (!customer) {
      customer = new Customer({
        orders: [],
        wishlist: [],
        cart: [],
        name,
        address: "",
        email,
        phone: "",
        gender: "Nam",
        birthday: new Date(),
      });
      await customer.save();
    }

    const token = jwt.sign(
      {
        customerId: customer._id,
      },
      "secret",
      { expiresIn: "24h" }
    );

    res.status(200).json({ user: customer, token: token });
  } catch (error) {
    next(new AppError(500, "Có lỗi xảy ra, vui lòng thử lại sau"));
  }
};

exports.signup = async (req, res, next) => {
  const { name, email, password, phone, address, gender, birthday } = req.body;

  try {
    const existingEmail = await Customer.findOne({ email });
    if (existingEmail) {
      const error = new Error("Email đã được sử dụng");
      error.statusCode = 422;
      return next(error);
    }

    const existingPhone = await Customer.findOne({ phone });
    if (existingPhone) {
      const error = new Error("Số điện thoại đã được sử dụng");
      error.statusCode = 422;
      return next(error);
    }

    const hashedPassword = bcryptjs.hashSync(password, 12);
    const account = new Account({
      username: email,
      password: hashedPassword,
    });
    await account.save();

    const customer = new Customer({
      account: account._id,
      orders: [],
      cart: [],
      wishlist: [],
      name,
      address: [],
      email,
      phone,
      gender,
      birthday,
    });
    await customer.save();

    res.status(201).json({ message: "Đăng ký thành công", data: customer });
  } catch (err) {
    const error = new Error("Có lỗi xảy ra, vui lòng thử lại sau");
    error.statusCode = 500;
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const email = req.body.email;
  const isCustomer = req.body.isCustomer;

  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      return res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại sau" });
    }

    const token = buffer.toString("hex");
    try {
      let accountId;
      if (isCustomer) {
        const customer = await Customer.findOne({ email });
        if (!customer) {
          return res.status(404).json({ message: "Email không tồn tại" });
        }

        accountId = customer.account;
      } else {
        const staff = await Staff.findOne({ email });
        if (!staff) {
          return res.status(404).json({ message: "Email không tồn tại" });
        }

        accountId = staff.account;
      }

      const account = await Account.findById(accountId);
      if (!account) {
        return res.status(404).json({ message: "Tài khoản không tồn tại" });
      }
      // nếu không có azure mail function nên dùng bên gửi mail khác
      const url = process.env.EMAIL_FUNC_AZURE;

      const emailBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <p>Xin chào,</p>
        <h2 style="color: #4CAF50;">Bạn vừa xác nhận quên mật khẩu</h2>
        <p>Chúng tôi đã cấp một đường dẫn cập nhật lại mật khẩu, vui lòng không chia sẻ:</p>
        <div style="font-size: 24px; font-weight: bold; padding: 10px; background-color: #f9f9f9; border: 1px solid #ddd; display: inline-block;">
          <a href="${process.env.RESET_PASSWORD_CLIENT}/${token}" target="_blank" style="color: #4CAF50; text-decoration: none;">
            ${process.env.RESET_PASSWORD_CLIENT}/${token}
          </a>
        </div>
        <p>Trân trọng,</p>
        <p>Đội ngũ hỗ trợ Clothing Shop</p>
        </div>
      `;

    const data = {
      toEmail: email,
      subject: 'Xác nhận quên mật khẩu - Clothing Shop',
      body: emailBody,
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      account.resetToken = token;
      account.resetTokenExpiration = Date.now() + 3600000;
      await account.save();
      return res.status(200).json({
        message: "Gửi yêu cầu khôi phục mật khẩu thành công",
        accountId: account._id,
      });
    } catch (error) {
      next(new AppError(500, "Có lỗi xảy ra khi xác thực tài khoản"))
    }
    } catch (err) {
      const error = new Error("Có lỗi xảy ra, vui lòng thử lại sau");
      error.statusCode = 500;
      next(error);
    }
  });
};

exports.resetPassword = async (req, res, next) => {
  const { token, password } = req.body;

  try {
    const existingAccount = await Account.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
    if (!existingAccount) {
      const error = new Error("Yêu cầu không còn hiệu lực");
      error.statusCode = 404;
      return next(error);
    }

    const hashedPassword = bcryptjs.hashSync(password, 12);

    existingAccount.password = hashedPassword;
    existingAccount.resetToken = undefined;
    existingAccount.resetTokenExpiration = undefined;
    await existingAccount.save();

    res.status(201).json({ message: "Thay đổi mật khẩu thành công" });
  } catch (err) {
    const error = new Error("Có lỗi xảy ra, vui lòng thử lại sau");
    error.statusCode = 500;
    next(error);
  }
};

exports.checkResetToken = async (req, res, next) => {
  const token = req.body.token;

  try {
    const existingAccount = await Account.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
    if (!existingAccount) {
      return res.status(404).json({ isValidToken: false });
    }

    res.status(200).json({ isValidToken: true });
  } catch (err) {
    const error = new Error("Có lỗi xảy ra, vui lòng thử lại sau");
    error.statusCode = 500;
    next(error);
  }
};

exports.staffLogin = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const staff = await Staff.findOne({ email: username }).populate("role");

    const account = await Account.findById(staff.account);
    if (!account) {
      throw new AppError(401, "Tên đăng nhập không tồn tại");
    }

    const isValidPassword = bcryptjs.compareSync(password, account.password);
    if (!isValidPassword) {
      throw new AppError(401, "Mật khẩu không đúng");
    }

    const token = jwt.sign({ username: account.username, staffId: staff._id.toString() }, "secret", {
      expiresIn: "24h",
    });

    res.status(200).json({ token, staff, message: "Đăng nhập thành công" });
  } catch (error) {
    next(error);
  }
};

exports.testEmail = async (req, res, next) => {
  const { name } = req.body;

  try {
    const data = {
      from: `'Support Clothing Store' <${process.env.USERNAME_EMAIL}>`,
      to: '21522211@gm.uit.edu.vn',
      subject: 'Test sử dụng nodemailer',
      text: 'email test nodemailer',
      html: `
        <h2>Xin chào, ${name}!</h2>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản của mình. Vui lòng nhấn vào liên kết bên dưới để đặt lại mật khẩu:</p>
        <a href="${name}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none;">Đặt lại mật khẩu</a>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
        <p>Trân trọng,<br>Đội ngũ hỗ trợ</p>
      `,
    }

    await handleSendMail(data)
    // sgMail.send({
    //   to: '21522211@gm.uit.edu.vn',
    //   from: process.env.SG_FROM_EMAIL,
    //   subject: 'Test sử dụng sendgrid',
    //   text: 'and easy to do anywhere, even with Node.js',
    //   html: `
    //     <h2>Xin chào, ${name}!</h2>
    //     <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản của mình. Vui lòng nhấn vào liên kết bên dưới để đặt lại mật khẩu:</p>
    //     <a href="${name}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none;">Đặt lại mật khẩu</a>
    //     <p>Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
    //     <p>Trân trọng,<br>Đội ngũ hỗ trợ</p>
    //   `,
    // });

    res.status(201).json({ message: "Test Email thành công" });
  } catch (err) {
    const error = new Error("Có lỗi xảy ra, vui lòng thử lại sau");
    error.statusCode = 500;
    next(error);
  }
};

const handleSendMail = async (val) => {
  try {
    await transporter.sendMail(val)

    return 'OK'
  } catch (error) {
    return error
  }
}