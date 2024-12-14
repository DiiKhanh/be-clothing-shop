const bcryptjs = require("bcryptjs");
const sgMail = require("@sendgrid/mail");

const Staff = require("../models/staff");
const Account = require("../models/account");
const Role = require("../models/role");
const AppError = require("../util/error");
const { staffStates, roleNames } = require("../constants");

sgMail.setApiKey(process.env.SG_API_KEY);

exports.createStaff = async (req, res, next) => {
  const { name, address, email, phone, gender, birthday } = req.body;

  try {
    const existingEmail = await Staff.findOne({ email });
    if (existingEmail) {
      throw new AppError(422, "Email đã được sử dụng");
    }

    const existingPhone = await Staff.findOne({ phone });
    if (existingPhone) {
      throw new AppError(422, "Số điện thoại đã được sử dụng");
    }

    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = bcryptjs.hashSync(randomPassword, 12);
    const account = new Account({ username: email, password: hashedPassword });
    await account.save();

    const staffRole = await Role.findOne({ name: roleNames.STAFF });

    const staff = new Staff({
      account: account._id,
      role: staffRole._id,
      name,
      address,
      email,
      phone,
      gender,
      birthday,
    });
    await staff.save();

    sgMail.send({
      to: email,
      from: process.env.SG_FROM_EMAIL,
      templateId: process.env.SG_SEND_PASSWORD_TEMPLATE_ID,
      dynamicTemplateData: {
        randomPassword,
      },
    });

    res.status(201).json({ message: "Thêm nhân viên thành công" });
  } catch (error) {
    next(error);
  }
};

exports.updateStaff = async (req, res, next) => {
  const { name, address, email, phone, gender, birthday, staffId, status } = req.body;

  try {
    const staff = await Staff.findById(staffId);
    if (!staff) {
      throw new AppError(404, "Nhân viên không tồn tại");
    }

    staff.name = name;
    staff.address = address;
    staff.email = email;
    staff.phone = phone;
    staff.gender = gender;
    staff.birthday = birthday;
    staff.status = status;
    await staff.save();

    res.status(200).json({ message: "Cập nhật nhân viên thành công", updatedStaff: staff });
  } catch (error) {
    next(error);
  }
};

exports.deleteStaff = async (req, res, next) => {
  const staffId = req.body.staffId;

  try {
    const staff = await Staff.findById(staffId);
    if (!staff) {
      throw new AppError(404, "Nhân viên không tồn tại");
    }

    staff.status = staffStates.NONACTIVE;
    await staff.save();

    res.status(200).json({ message: "Xóa nhân viên thành công" });
  } catch (error) {
    next(error);
  }
};

exports.getStaffs = async (req, res, next) => {
  try {
    const staffs = await Staff.find().populate("role");
    res.status(200).json({ staffs });
  } catch (error) {
    const err = new AppError(500, "Có lỗi xảy ra, vui lòng thử lại sau");
    next(err);
  }
};

exports.getStaffById = async (req, res, next) => {
  const staffId = req.params.staffId;

  try {
    const staff = await Staff.findById(staffId).populate("role");
    if (!staff) {
      throw new AppError(404, "Nhân viên không tồn tại");
    }

    res.status(200).json({ staff });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  const { newPassword, oldPassword } = req.body;
  const staffId = req.staffId;

  try {
    const staff = await Staff.findById(staffId);
    if (!staff) {
      throw new AppError(404, "Nhân viên không tồn tại");
    }

    const account = await Account.findById(staff.account);
    const isOldValidPassword = bcryptjs.compareSync(oldPassword, account.password);
    if (!isOldValidPassword) {
      throw new AppError(401, "Mật khẩu cũ không đúng");
    }

    const hashedPassword = bcryptjs.hashSync(newPassword, 12);
    account.password = hashedPassword;
    await account.save();

    res.status(200).json({ message: "Thay đổi mật khẩu thành công" });
  } catch (error) {
    next(error);
  }
};
