const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { roleNames } = require("../constants");

const roleSchema = new Schema({
  name: {
    type: String,
    enum: roleNames,
    required: true,
  },
});

module.exports = mongoose.model("Role", roleSchema);
