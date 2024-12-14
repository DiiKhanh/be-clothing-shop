const twilio = require("twilio");
const brcyptjs = require("bcryptjs");
const axios = require("axios");

const Customer = require("../models/customer");
const Account = require("../models/account");
const AppError = require("../util/error");

exports.updateProfile = async (req, res, next) => {
  const customerId = req.customerId;

  try {
    const { name, phoneNumber, birthday, gender } = req.body;

    const customer = await Customer.findById(customerId).populate("cart.productId").populate("orders").populate('wishlist');
    if (!customer) {
      throw new AppError(404, "Khách hàng không tồn tại");
    }

    if (phoneNumber !== customer.phone) {
      const existingCustomer = await Customer.findOne({ phone: phoneNumber });
      if (existingCustomer) {
        throw new AppError(422, "Số điện thoại đã được sử dụng");
      }
    }

    customer.name = name;
    customer.phone = phoneNumber;
    customer.birthday = birthday;
    customer.gender = gender;
    await customer.save();

    res.status(201).json({ message: "Cập nhật thông tin thành công", updatedCustomer: customer });
  } catch (error) {
    next(error);
  }
};

exports.verifyPhoneNumber = async (req, res, next) => {
  const { phoneNumber } = req.body;

  const vietnamPhoneCode = "+84";
  const formatedPhoneNumber = vietnamPhoneCode + phoneNumber.slice(1);
  const otpCode = Math.floor(Math.random() * 1000000);

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  client.messages
    .create({
      body: `Mã xác minh của bạn là: ${otpCode}\nVui lòng không chia sẻ mã này cho bất kỳ ai`,
      messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
      to: formatedPhoneNumber,
    })
    .then((message) => res.status(200).json({ message: "Mã xác minh đã được gửi đến số điện thoại của bạn", otpCode }))
    .catch((error) => {
      next(new AppError(500, "Có lỗi xảy ra khi gửi mã xác minh"));
    });
};

exports.verifyEmail = async (req, res, next) => {
  const { email } = req.body;

  const otpCode = Math.floor(100000 + Math.random() * 900000);

  // nếu không có azure mail function nên dùng bên gửi mail khác
  const url = process.env.EMAIL_FUNC_AZURE;

  const emailBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <h2 style="color: #4CAF50;">Mã xác thực của bạn</h2>
      <p>Xin chào,</p>
      <p>Đây là mã xác thực của bạn, vui lòng không chia sẻ đoạn mã này:</p>
      <div style="font-size: 24px; font-weight: bold; padding: 10px; background-color: #f9f9f9; border: 1px solid #ddd; display: inline-block;">
        ${otpCode}
      </div>
      <p style="margin-top: 20px;">Mã này sẽ hết hạn sau 1 phút.</p>
      <p>Trân trọng,</p>
      <p>Đội ngũ hỗ trợ Clothing Shop</p>
    </div>
  `;

  const data = {
    toEmail: email,
    subject: 'Mã Xác Thực Email - Clothing Shop',
    body: emailBody,
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.status(200).json({ message: "Mã xác minh đã được gửi đến email của bạn", otpCode })
  } catch (error) {
    next(new AppError(500, "Có lỗi xảy ra khi gửi mã xác minh"))
  }
};

exports.updateUserIsVerified = async (req, res, next) => {
  const customerId = req.customerId;

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new AppError(404, "Không tìm thấy khách hàng");
    }
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = brcyptjs.hashSync(randomPassword, 12);

    // nếu không có azure mail function nên dùng bên gửi mail khác
    const url = process.env.EMAIL_FUNC_AZURE;

    const emailBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <p>Xin chào,</p>
        <h2 style="color: #4CAF50;">Bạn vừa xác nhận tài khoản thành công</h2>
        <p>Chúng tôi đã cấp một tài khoản cho bạn với tên đăng nhập là email: ${customer.email} và mật khẩu là:</p>
        <div style="font-size: 24px; font-weight: bold; padding: 10px; background-color: #f9f9f9; border: 1px solid #ddd; display: inline-block;">
        ${randomPassword}
        </div>
        <p style="font-weight: bold">Lưu ý: Hãy thay đổi mật khẩu sớm nhất có thể!</p>
        <p>Trân trọng,</p>
        <p>Đội ngũ hỗ trợ Clothing Shop</p>
      </div>
    `;

    const data = {
      toEmail: customer.email,
      subject: 'Xác thực Email và Password - Clothing Shop',
      body: emailBody,
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      customer.verified = true;
      const account = await Account.findById(customer.account);
      account.password = hashedPassword;
      await account.save();
      await customer.save();
      return res.status(200).json({ message: "Mã xác minh đã được gửi đến email của bạn" })
    } catch (error) {
      next(new AppError(500, "Có lỗi xảy ra khi xác thực tài khoản"))
    }
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  const { newPassword } = req.body;
  const customerId = req.customerId;

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new AppError(404, "Không tìm thấy khách hàng");
    }

    const hashedPassword = brcyptjs.hashSync(newPassword, 12);
    const account = await Account.findById(customer.account);
    account.password = hashedPassword;
    await account.save();

    res.status(200).json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    next(error);
  }
};

exports.addAddress = async (req, res, next) => {
  const { name, phoneNumber, detail, city, district, ward } = req.body;
  const customerId = req.customerId;

  try {
    const newAddress = {
      name,
      phone: phoneNumber,
      detail,
      city,
      district,
      ward,
    };

    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new AppError(404, "Không tìm thấy khách hàng");
    }

    customer.address.push(newAddress);
    await customer.save();

    res.status(201).json({ message: "Thêm địa chỉ thành công", updatedAddresses: customer.address });
  } catch (error) {
    next(error);
  }
};

exports.editAddress = async (req, res, next) => {
  const { name, phoneNumber, detail, city, district, ward, _id } = req.body;
  const customerId = req.customerId;

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new AppError(404, "Không tìm thấy khách hàng");
    }

    const existingAddress = customer.address.find((item) => item._id.toString() === _id);
    if (!existingAddress) {
      throw new AppError(404, "Địa chỉ không tồn tại");
    }

    existingAddress.name = name;
    existingAddress.phone = phoneNumber;
    existingAddress.detail = detail;
    existingAddress.city = city;
    existingAddress.district = district;
    existingAddress.ward = ward;
    await customer.save();

    res.status(201).json({ message: "Cập nhật địa chỉ thành công", updatedAddresses: customer.address });
  } catch (error) {
    next(error);
  }
};

exports.removeAddress = async (req, res, next) => {
  const { _id: addressId } = req.body;
  const customerId = req.customerId;

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new AppError(404, "Không tìm thấy khách hàng");
    }

    const updatedAddresses = customer.address.filter((item) => item._id.toString() !== addressId);
    customer.address = updatedAddresses;
    await customer.save();

    res.status(200).json({ message: "Xóa địa chỉ thành công", updatedAddresses: customer.address });
  } catch (error) {
    next(error);
  }
};

exports.updateAddressToDefault = async (req, res, next) => {
  const { _id: addressId } = req.body;
  const customerId = req.customerId;

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new AppError(404, "Không tìm thấy khách hàng");
    }

    const updatedAddresses = [...customer.address];
    updatedAddresses.forEach((item) => {
      if (item.isDefault) {
        item.isDefault = false;
      }

      if (item._id.toString() === addressId) {
        item.isDefault = true;
      }
    });

    customer.address = updatedAddresses;
    await customer.save();

    res.status(200).json({ message: "Đã đặt địa chỉ thành mặc định", updatedAddresses: customer.address });
  } catch (error) {
    next(error);
  }
};

exports.getCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find().populate("orders").populate("cart.productId").populate('wishlist');
    res.status(200).json({ customers });
  } catch (error) {
    const err = new AppError(500, "Có lỗi xảy ra, vui lòng thử lại sau");
    next(err);
  }
};

exports.getCustomerById = async (req, res, next) => {
  const customerId = req.params.customerId;

  try {
    const customer = await Customer.findById(customerId).populate("orders").populate("cart.productId").populate('wishlist');
    if (!customer) {
      throw new AppError(404, "Khách hàng không tồn tại");
    }

    res.status(200).json({ customer });
  } catch (error) {
    next(error);
  }
};
