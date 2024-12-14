const mongoose = require("mongoose");
const { genders, staffStates } = require("../constants");
const Schema = mongoose.Schema;

const staffSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: "Account",
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: Object.values(genders),
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: staffStates,
    default: Object.values(staffStates)[0],
  },
});

module.exports = mongoose.model("Staff", staffSchema);
